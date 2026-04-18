// src/products/product-ai.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Products, ProductDocument } from 'src/modules/products/schema/product.schema';
import { AiService } from 'src/modules/ai/ai.service';
import { productsDescriptionPrompt } from 'src/modules/products/ai/prompt';

@Processor('products-queue')
@Injectable()
export class ProductAiProcessor {
  private readonly logger = new Logger(ProductAiProcessor.name);

  constructor(
    @InjectModel(Products.name) private productModel: Model<ProductDocument>,
    private readonly aiService: AiService
  ) { }

  @Process('generate-description')
  async process(job: Job<any>): Promise<any> {
    const { productId, productName } = job.data;

    try {
      const prompt = await productsDescriptionPrompt(productName);

      const generatedText = await this.aiService.generateWithOllama(prompt);

      const textToEmbed = `search_document: ${productName}. ${generatedText}`;
      const vectorEmbedding = await this.aiService.generateEmbedding(textToEmbed);

      // Update MongoDB
      await this.productModel.findByIdAndUpdate(
        productId,
        {
          $set: {
            description: generatedText,
            embedding: vectorEmbedding,
            status: 'completed'
          }
        }
      ).exec();

      this.logger.log(`Successfully updated product ${productId}`);
      return { success: true };

    } catch (error) {
      this.logger.error(`Job failed for product ${productId}`, error);
      throw error;
    }
  }

}