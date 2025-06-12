import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), AuthModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
