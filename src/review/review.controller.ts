import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Roles } from 'src/auth/decorators/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CLIENTE)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('order/:orderId')
  create(
    @Param('orderId') orderId: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: User,
  ) {
    return this.reviewService.create(orderId, createReviewDto, user);
  }
}
