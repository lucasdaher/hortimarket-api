import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private async getOrCreateCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!cart) {
      cart = this.cartRepository.create({ user, items: [] });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  async addToCart(addToCartDto: AddToCartDto, user: User): Promise<Cart> {
    const { productId, quantity } = addToCartDto;
    const cart = await this.getOrCreateCart(user);

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(
        `Produto com ID ${productId} não encontrado.`,
      );
    }
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Estoque insuficiente para o produto "${product.name}".`,
      );
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({ cart, product, quantity });
    }

    await this.cartItemRepository.save(cartItem);
    return this.getCart(user);
  }

  async getCart(user: User): Promise<any> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product', 'items.product.store'],
    });

    if (!cart) {
      return { items: [], totalPrice: 0 };
    }

    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * Number(item.product.price);
    }, 0);

    return { ...cart, totalPrice: parseFloat(totalPrice.toFixed(2)) };
  }

  async updateItemQuantity(
    productId: number,
    quantity: number,
    user: User,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Produto com ID ${productId} não encontrado no carrinho.`,
      );
    }

    if (quantity === 0) {
      await this.cartItemRepository.remove(cartItem);
    } else {
      if (cartItem.product.stock < quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto "${cartItem.product.name}".`,
        );
      }
      cartItem.quantity = quantity;
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(user);
  }

  async removeItem(productId: number, user: User): Promise<Cart> {
    const cart = await this.getOrCreateCart(user);
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Produto com ID ${productId} não encontrado no carrinho.`,
      );
    }

    await this.cartItemRepository.remove(cartItem);
    return this.getCart(user);
  }
}
