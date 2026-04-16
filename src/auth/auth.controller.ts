import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto, LoginAuthDto, RespondAuthDto } from './dto/index';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RespondUserDto } from '@/users/dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: RegisterAuthDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: RespondUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      example: {
        message: [
          'name must be a string',
          'name should not be empty',
          'email must be an email',
          'email must be a string',
          'email should not be empty',
          'password must be a string',
          'password should not be empty',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    schema: {
      example: {
        message: 'Email already exists',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        message: 'Internal server error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
  ): Promise<RespondUserDto> {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: RespondAuthDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      example: {
        message: [
          'email must be an email',
          'email must be a string',
          'email should not be empty',
          'password must be a string',
          'password should not be empty',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        message: 'Internal server error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  async login(@Body() loginAuthDto: LoginAuthDto): Promise<RespondAuthDto> {
    return this.authService.login(loginAuthDto);
  }
}
