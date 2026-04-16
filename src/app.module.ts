import { Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
//import { LoggerMiddleware } from './common/logs/logger.middleware';
import { OrderingModule } from './modules/ordering/ordering.module';
import { CommentsModule } from './modules/comments/comments.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all_exception.filter';
import { BullModule } from '@nestjs/bull';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrderingModule,
    CommentsModule,
    AuthModule,
    AdminModule,
    MongooseModule.forRoot(
      'mongodb://admin:admin123@localhost:27017/driveyfy?authSource=admin',
    ),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    AiModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer) {
    //consumer.apply(LoggerMiddleware).forRoutes('*');
    // Additional configuration can be added here if needed
  }
}
