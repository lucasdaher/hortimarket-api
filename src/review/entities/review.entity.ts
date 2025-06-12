import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column('text', { nullable: true })
  comment: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
}
