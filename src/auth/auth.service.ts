import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto, LoginAuthDto } from './dto/index';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }
  async register(registerAuthDto: RegisterAuthDto) {
    return this.usersService.create(registerAuthDto);
  }

  async login(loginAuthDto: LoginAuthDto) {

    const user = await this.usersService.findByEmail(loginAuthDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(loginAuthDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      token,
      email: user.email,
    };

  }
}
