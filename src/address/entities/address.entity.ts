import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  street: string;

  @Column({ length: 10 })
  number: string;

  @Column({ length: 100, nullable: true })
  complement: string;

  @Column({ length: 50 })
  neighborhood: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column({ length: 9 })
  zipCode: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
