import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/store/entities/store.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Store]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
