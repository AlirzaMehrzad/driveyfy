import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument, Products } from './schema/product.schema';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/modules/users/users.service';
import { AiService } from 'src/modules/ai/ai.service';
import { productsDescriptionPrompt } from 'src/modules/products/ai/prompt';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ProductsService {
  constructor(
    private readonly aiService: AiService,
    @InjectQueue('products-queue') private productsQueue: Queue,
    @InjectModel(Products.name) private productModel: Model<ProductDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }

  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  createProduct = async (req, createProductDto: CreateProductDto) => {
    const userId = new Types.ObjectId(req.user.id);
    const product = await this.productModel.create({
      ...createProductDto,
      owner: userId,
    });
    if (!product)
      throw new HttpException('مشکلی در ایجاد محصول بهوجود آمد', 400);

    // Update AI generated description in background
    await this.productsQueue.add('generate-description', {
      productId: product.id,
      productName: product.title,
    });

    return product;
  };

  findAllProducts = async (query) => {
    const prodcuts = await this.productModel
      .find()
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit ? parseInt(query.limit) : 10);

    return prodcuts;
  };

  findProductById = async (id) => {
    const product = await this.productModel.findById(id);
    if (!product) return false;

    return product;
  };

  updateProduct = async (req, id, updateProductDto: UpdateProductDto) => {
    const userId = new Types.ObjectId(req.user.id);
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: id,
        owner: userId,
        'deleted.status': { $ne: true },
      },
      { $set: updateProductDto },
      { new: true },
    );
    if (!product) return false;

    return product;
  };

  removeProduct = async (req, id) => {
    const userId = new Types.ObjectId(req.user.id);
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: id,
        owner: userId,
        'deleted.status': { $ne: true },
      },
      {
        $set: {
          'deleted.status': true,
          'deleted.deletedAt': new Date(),
          'deleted.deletedBy': userId,
        },
      },
      { new: true },
    );

    if (!product) return false;

    return true;
  };

  hybridSearch = async (searchQuery: string) => {
    // ==========================================
    // 1. KEYWORD SEARCH (Find exact title matches)
    // ==========================================
    // We use $regex with option 'i' (case-insensitive) to find partial or exact title matches
    const keywordMatches = await this.productModel
      .find({ name: { $regex: searchQuery, $options: 'i' } })
      .lean()
      .exec();

    // Map them and give them a manually high "score" since an exact title match is highly relevant
    const formattedKeywordResults = keywordMatches.map(product => ({
      _id: product._id.toString(),
      name: product.title,
      description: product.description,
      score: 1.0, // Top priority
      matchType: 'keyword' // Just to help us see how it was found
    }));

    // ==========================================
    // 2. SEMANTIC SEARCH (Find conceptual matches)
    // ==========================================
    const queryVector = await this.aiService.generateEmbedding(`search_query: ${searchQuery}`);

    const allProducts = await this.productModel
      .find({ embedding: { $exists: true } })
      .select('+embedding')
      .lean()
      .exec();

    const semanticMatches = allProducts.map((product) => {
      return {
        _id: product._id.toString(),
        name: product.title,
        description: product.description,
        score: this.calculateCosineSimilarity(queryVector, product.embedding),
        matchType: 'semantic'
      };
    });

    // Sort semantic matches by highest score and grab the top 5
    semanticMatches.sort((a, b) => b.score - a.score);
    const topSemanticResults = semanticMatches.slice(0, 5);

    // ==========================================
    // 3. COMBINE AND DEDUPLICATE
    // ==========================================
    // We want the keyword matches at the top, followed by the semantic matches.
    const combinedResults = [...formattedKeywordResults, ...topSemanticResults];

    // Remove duplicates (in case a product was found by BOTH the title and the semantic search)
    const uniqueResults: any[] = [];
    const seenIds = new Set();

    for (const result of combinedResults) {
      if (!seenIds.has(result._id)) {
        seenIds.add(result._id);
        uniqueResults.push(result);
      }
    }

    // Return the top 5 overall unique results
    return uniqueResults.slice(0, 5);
  }

}
