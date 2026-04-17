// src/comments/comment-ai.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comments, CommentDocument } from '../schema/comment.schema';
import { Products, ProductDocument } from '../../products/schema/product.schema';
import { AiService } from 'src/modules/ai/ai.service';
import { commentsRecapPrompt } from './prompt';

@Processor('comments-queue')
@Injectable()
export class CommentAiProcessor {
    private readonly logger = new Logger(CommentAiProcessor.name);

    constructor(
        @InjectModel(Comments.name) private commentModel: Model<CommentDocument>,
        @InjectModel(Products.name) private productModel: Model<ProductDocument>,
        private readonly aiService: AiService,
    ) { }

    @Process('summarize-comments')
    async process(job: Job<any>): Promise<any> {
        const { productId } = job.data;

        try {
            this.logger.log(`Generating new summary for product: ${productId}`);

            // 1. Fetch the last 5 comments for this specific product, sorted by newest first
            const lastComments = await this.commentModel
                .find({ productRef: productId })
                .sort({ createdAt: -1 })
                .limit(10)
                .exec();
            // If there are no comments, just exit cleanly
            if (lastComments.length === 0) return { success: true, message: 'No comments found' };
            // 2. Format the comments into a single readable string for the AI
            const commentsText = lastComments
                .map((c, index) => `${index + 1}. "${c.text}"`)
                .join('\n');

            // 3. Craft the AI Prompt
            const prompt = commentsRecapPrompt(commentsText);
            // 4. Call local Ollama model (Takes ~1-2 seconds)
            const aiSummary = await this.aiService.generateWithDeepSeek(prompt);
            // 5. Update the Product document with the new AI summary
            await this.productModel.findByIdAndUpdate(
                productId,
                {
                    $set: {
                        summary: aiSummary.trim(), // Assuming you have this field in your Product Schema
                        summaryUpdatedAt: new Date()
                    }
                }
            ).exec();

            this.logger.log(`Successfully updated AI summary for product ${productId}`);
            return { success: true };

        } catch (error) {
            this.logger.error(`Failed to summarize comments for product ${productId}`, error);
            throw error; // Let BullMQ retry the job if it fails
        }
    }
}