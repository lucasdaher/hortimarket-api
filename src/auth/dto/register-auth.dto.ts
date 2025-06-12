import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class RegisterAuthDto {
  @IsString({ message: 'O nome deve ser um texto.' })
  name: string;

  @IsEmail({}, { message: 'O e-mail informado não é válido.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'O papel informado não é válido.' })
  role?: Role;
}
