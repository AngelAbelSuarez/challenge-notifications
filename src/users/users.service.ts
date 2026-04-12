import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto, RespondUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<RespondUserDto> {
    const email = await this.usersRepository.findByEmail(createUserDto.email);

    if (email) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersRepository.create(createUserDto);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdDate: user.createdDate,
      updatedDate: user.updatedDate,
      deletedAt: user.deletedAt,
    };
  }

  async findAll(): Promise<RespondUserDto[]> {
    return await this.usersRepository.findAll();
  }

  async findById(id: string): Promise<RespondUserDto | undefined> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<RespondUserDto> {
    await this.findById(id);

    const email = await this.usersRepository.findAllEmail({
      email: updateUserDto.email,
    });

    if (email.length === 1 && email[0].id !== id) {
      throw new ConflictException('Email already exists');
    }

    const userUpdated = await this.usersRepository.update(id, updateUserDto);
    if (!userUpdated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return userUpdated;
  }

  async delete(id: string): Promise<{ message: string; id: string }> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return {
      message: 'User deleted successfully',
      id,
    };
  }
}
