import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto, user: User): Promise<Store> {
    const existingStore = await this.storeRepository.findOne({
      where: { owner: { id: user.id } },
    });
    if (existingStore) {
      throw new ConflictException(
        'Este usuário já possui uma loja cadastrada.',
      );
    }
    const store = this.storeRepository.create({
      ...createStoreDto,
      owner: user,
    });
    return this.storeRepository.save(store);
  }

  async findStoreByOwner(ownerId: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { owner: { id: ownerId } },
    });
    if (!store) {
      throw new NotFoundException('Nenhuma loja encontrada para este usuário.');
    }
    return store;
  }

  async update(
    ownerId: number,
    updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    const store = await this.findStoreByOwner(ownerId);
    this.storeRepository.merge(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async remove(ownerId: number): Promise<{ message: string }> {
    const store = await this.findStoreByOwner(ownerId);
    await this.storeRepository.remove(store);
    return { message: `Loja "${store.name}" removida com sucesso.` };
  }
}
