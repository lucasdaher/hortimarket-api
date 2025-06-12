import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateAddressDto {
  @IsString() @IsOptional() street?: string;
  @IsString() @IsOptional() number?: string;
  @IsString() @IsOptional() complement?: string;
  @IsString() @IsOptional() neighborhood?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() @Length(2, 2) state?: string;
  @IsString() @IsOptional() @Length(8, 9) zipCode?: string;
}
