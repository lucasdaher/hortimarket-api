import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';
export class AddToCartDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
