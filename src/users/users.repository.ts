import { Injectable } from '@nestjs/common';
import { Users } from '@/users/entities/user.entity';
import { CreateUserDto, UpdateUserDto, RespondUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findAll(): Promise<RespondUserDto[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findById(id: string): Promise<RespondUserDto | null> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<RespondUserDto | null> {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOneBy({ id });
  }

  async findAllEmail(criteria: any): Promise<RespondUserDto[]> {
    return this.userRepository.find({ where: criteria });
  }

  async delete(id: string): Promise<UpdateResult> {
    return await this.userRepository.softDelete(id);
  }

  async findByPassword(email: string): Promise<string | undefined> {
    const user = await this.userRepository.findOneBy({ email });
    return user?.password;
  }
}
