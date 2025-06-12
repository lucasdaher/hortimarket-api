import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Store } from 'src/store/entities/store.entity';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findAllPublic(options: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const { page, limit, search } = options;
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.store', 'store')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.stock',
        'store.id',
        'store.name',
      ]);

    if (search) {
      queryBuilder.where('product.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const offset = (page - 1) * limit;
    const products = await queryBuilder.skip(offset).take(limit).getMany();
    const total = await queryBuilder.getCount();

    return {
      data: products,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };
  }

  async findOnePublic(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['store'],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        store: {
          id: true,
          name: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return product;
  }

  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const store = await this.storeRepository.findOne({
      where: { owner: { id: user.id } },
    });
    if (!store) {
      throw new NotFoundException(
        'Você precisa cadastrar uma loja antes de adicionar produtos.',
      );
    }
    const product = this.productRepository.create({
      ...createProductDto,
      store,
    });
    return this.productRepository.save(product);
  }

  async findAllByOwner(ownerId: number): Promise<Product[]> {
    const store = await this.storeRepository.findOne({
      where: { owner: { id: ownerId } },
    });
    if (!store) {
      return [];
    }
    return this.productRepository.find({ where: { store: { id: store.id } } });
  }

  async findOne(id: number, ownerId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['store', 'store.owner'],
    });
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    if (product.store.owner.id !== ownerId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este produto.',
      );
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    ownerId: number,
  ): Promise<Product> {
    const product = await this.findOne(id, ownerId);
    this.productRepository.merge(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number, ownerId: number): Promise<{ message: string }> {
    const product = await this.findOne(id, ownerId);
    await this.productRepository.remove(product);
    return { message: `Produto "${product.name}" removido com sucesso.` };
  }
}
