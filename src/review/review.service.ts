import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderStatus } from 'src/order/enums/order-status.enum';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(orderId: string, createReviewDto: CreateReviewDto, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: user.id } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new BadRequestException(
        'Pedido não encontrado ou não pertence a este usuário.',
      );
    }
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException(
        'Você só pode avaliar pedidos que já foram entregues.',
      );
    }

    const reviews: Review[] = [];
    for (const item of order.items) {
      const review = this.reviewRepository.create({
        ...createReviewDto,
        user,
        product: item.product,
      });
      reviews.push(await this.reviewRepository.save(review));
    }
    return { message: 'Avaliação registrada com sucesso.', reviews };
  }
}
