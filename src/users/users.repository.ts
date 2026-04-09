import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { CreateUserDto, UpdateUserDto, RespondUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientsDragonBallZ } from '@/ClientsDragonBallZ/clients.service';
import { CharacterDto } from 'src/ClientsDragonBallZ/dto/character.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private clientsDragonBallZ: ClientsDragonBallZ,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findAll(): Promise<RespondUserDto[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findCharacters(ids: number[]): Promise<CharacterDto[]> {
    const characters = await this.clientsDragonBallZ.getCharacterByIds(ids);
    return characters;
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

  async delete(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
