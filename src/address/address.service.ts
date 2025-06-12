import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  create(createAddressDto: CreateAddressDto, user: User) {
    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });
    return this.addressRepository.save(address);
  }

  findAll(user: User) {
    return this.addressRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: number, user: User) {
    const address = await this.addressRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!address) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado.`);
    }
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto, user: User) {
    const address = await this.findOne(id, user);
    this.addressRepository.merge(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async remove(id: number, user: User) {
    const address = await this.findOne(id, user);
    await this.addressRepository.remove(address);
    return { message: 'Endereço removido com sucesso.' };
  }
}
