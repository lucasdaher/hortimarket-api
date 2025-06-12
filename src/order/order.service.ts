import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';
import { Address } from 'src/address/entities/address.entity';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class OrderService {
  constructor(
    // O construtor permanece o mesmo, as dependências já estão corretas
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: user.id } },
        relations: ['items', 'items.product'],
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Seu carrinho está vazio.');
      }

      const address = await queryRunner.manager.findOne(Address, {
        where: { id: createOrderDto.addressId, user: { id: user.id } },
      });

      if (!address) {
        throw new NotFoundException(
          'Endereço não encontrado ou não pertence a este usuário.',
        );
      }

      const total = cart.items.reduce(
        (acc, item) => acc + item.quantity * Number(item.product.price),
        0,
      );

      const order = new Order();
      order.user = user;
      order.shippingAddress = address;
      order.total = parseFloat(total.toFixed(2));
      order.status = OrderStatus.PROCESSING;
      order.items = [];

      for (const item of cart.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!product)
          throw new NotFoundException(
            `Produto não encontrado, tente novamente.`,
          );
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto ${product.name}.`,
          );
        }
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        const orderItem = new OrderItem();
        orderItem.product = item.product;
        orderItem.quantity = item.quantity;
        orderItem.price = Number(item.product.price);
        order.items.push(orderItem);
      }

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.manager.remove(cart);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(user: User) {
    if (user.role === Role.CLIENTE) {
      return this.orderRepository.find({
        where: { user: { id: user.id } },
        order: { orderDate: 'DESC' },
      });
    }
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .leftJoin('product.store', 'store')
      .where('store.owner_id = :ownerId', { ownerId: user.id })
      .orderBy('order.orderDate', 'DESC')
      .getMany();
  }

  async findOne(id: string, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'shippingAddress', 'user'],
    });
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }
    if (user.role === Role.CLIENTE && order.user.id !== user.id) {
      throw new ForbiddenException('Acesso negado.');
    }
    if (order.user) {
      const { id, name, email, role, createdAt, updatedAt } = order.user;
      order.user = { id, name, email, role, createdAt, updatedAt } as User;
    }
    return order;
  }

  async updateStatus(id: string, status: OrderStatus, user: User) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }
    order.status = status;
    return this.orderRepository.save(order);
  }
}
