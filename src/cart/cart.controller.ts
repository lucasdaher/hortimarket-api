import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CLIENTE)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() addToCartDto: AddToCartDto, @GetUser() user: User) {
    return this.cartService.addToCart(addToCartDto, user);
  }

  @Get()
  getCart(@GetUser() user: User) {
    return this.cartService.getCart(user);
  }

  @Patch('item/:productId')
  updateItemQuantity(
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @GetUser() user: User,
  ) {
    return this.cartService.updateItemQuantity(
      +productId,
      updateCartItemDto.quantity,
      user,
    );
  }

  @Delete('item/:productId')
  removeItem(@Param('productId') productId: string, @GetUser() user: User) {
    return this.cartService.removeItem(+productId, user);
  }
}
