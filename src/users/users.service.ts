import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  CreateUserDto,
  UpdateUserDto,
  RespondUserDto,
  RespondUserDragonBallZDto,
} from './dto';

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
      dragonBallZIds: user.dragonBallZIds || [],
    };
  }

  async findAll(): Promise<RespondUserDto[]> {
    return await this.usersRepository.findAll();
  }

  async findByIdwIThDragonBallZ(
    id: string,
  ): Promise<RespondUserDragonBallZDto | undefined> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    let dragonBallZCharacters;

    if (user.dragonBallZIds && user.dragonBallZIds.length > 0) {
      dragonBallZCharacters = await this.usersRepository.findCharacters(
        user.dragonBallZIds,
      );
    }

    const userWithCharacters = {
      id: user.id,
      name: user.name,
      email: user.email,
      dragonBallZCharacters: dragonBallZCharacters || [],
    };

    return userWithCharacters;
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

  async delete(id: string): Promise<boolean> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return true;
  }
}
