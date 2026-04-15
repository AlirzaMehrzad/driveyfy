import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { ProductsModule } from 'src/modules/products/products.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ProductsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET
        ? process.env.JWT_SECRET
        : 'defaultSecretKey',
      signOptions: { expiresIn: '1d' }, // Token expiration time
    }),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule { }

