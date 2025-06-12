import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { OrderStatus } from './enums/order-status.enum';
import { Roles } from 'src/auth/decorators/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @Roles(Role.CLIENTE)
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  @Roles(Role.CLIENTE, Role.LOJISTA)
  findAll(@GetUser() user: User) {
    return this.orderService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.CLIENTE, Role.LOJISTA)
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.orderService.findOne(id, user);
  }

  @Patch(':id/deliver')
  @Roles(Role.LOJISTA)
  markAsDelivered(@Param('id') id: string, @GetUser() user: User) {
    return this.orderService.updateStatus(id, OrderStatus.DELIVERED, user);
  }
}
