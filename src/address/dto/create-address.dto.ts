import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString() @IsNotEmpty() street: string;
  @IsString() @IsNotEmpty() number: string;
  @IsString() @IsOptional() complement?: string;
  @IsString() @IsNotEmpty() neighborhood: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() @Length(2, 2) state: string;
  @IsString() @IsNotEmpty() @Length(8, 9) zipCode: string;
}
