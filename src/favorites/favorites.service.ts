import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async add(productId: number, user: User) {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }
    const userWithFavorites = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['favorites'],
    });
    if (!userWithFavorites) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    userWithFavorites.favorites.push(product);
    await this.userRepository.save(userWithFavorites);
    return { message: 'Produto adicionado aos favoritos.' };
  }

  async remove(productId: number, user: User) {
    const userWithFavorites = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['favorites'],
    });
    if (!userWithFavorites) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    userWithFavorites.favorites = userWithFavorites.favorites.filter(
      (p) => p.id !== productId,
    );
    await this.userRepository.save(userWithFavorites);
    return { message: 'Produto removido dos favoritos.' };
  }

  async findAll(user: User) {
    const userWithFavorites = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['favorites'],
    });
    if (!userWithFavorites) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return userWithFavorites.favorites;
  }
}
