import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { FavoritesService } from './favorites.service';
import { Roles } from 'src/auth/decorators/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CLIENTE)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  add(@Param('productId') productId: string, @GetUser() user: User) {
    return this.favoritesService.add(+productId, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.favoritesService.findAll(user);
  }

  @Delete(':productId')
  remove(@Param('productId') productId: string, @GetUser() user: User) {
    return this.favoritesService.remove(+productId, user);
  }
}
