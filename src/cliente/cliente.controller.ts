import { Controller, Get, UseGuards, Put, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ClienteService } from './cliente.service';
import { UpdateProfileDto } from 'src/cliente/dto/update-profile.dto';

@Controller('cliente')
@UseGuards(JwtAuthGuard)
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get('perfil')
  getProfile(@GetUser() user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  @Put('perfil')
  updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.clienteService.updateProfile(user.id, updateProfileDto);
  }
}
