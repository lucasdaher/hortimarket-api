import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('store')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @Roles(Role.LOJISTA)
  create(@Body() createStoreDto: CreateStoreDto, @GetUser() user: User) {
    return this.storeService.create(createStoreDto, user);
  }

  @Get('my-store')
  @Roles(Role.LOJISTA)
  findMyStore(@GetUser() user: User) {
    return this.storeService.findStoreByOwner(user.id);
  }

  @Put()
  @Roles(Role.LOJISTA)
  update(@GetUser() user: User, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(user.id, updateStoreDto);
  }

  @Delete()
  @Roles(Role.LOJISTA)
  remove(@GetUser() user: User) {
    return this.storeService.remove(user.id);
  }
}
