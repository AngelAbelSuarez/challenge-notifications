import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto, LoginAuthDto, RespondAuthDto } from './dto/index';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerAuthDto: RegisterAuthDto) {
    return this.usersService.create(registerAuthDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usersService.findByEmail(loginAuthDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const password = await this.usersService.findUserPassword(
      loginAuthDto.email,
    );

    if (!password) {
      throw new NotFoundException('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(
      loginAuthDto.password,
      password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return new RespondAuthDto({
      token,
      id: user.id,
      email: user.email,
    });
  }
}
