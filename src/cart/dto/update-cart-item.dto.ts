import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @Min(0, { message: 'A quantidade não pode ser negativa.' })
  quantity: number;
}
