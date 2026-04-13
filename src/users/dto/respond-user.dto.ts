import { ApiProperty } from '@nestjs/swagger';
import { Users } from '../entities/user.entity';

export class RespondUserDto {
  @ApiProperty({
    example: '4a488157-4198-4489-9c89-859d76ccb060',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The password of the user'
  })
  password: string;    

  @ApiProperty({
    example: new Date(),
    description: 'The date when the user was created',
  })
  createdDate: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The date when the user was updated',
  })
  updatedDate: Date;

  @ApiProperty({
    example: null,
    description: 'The date when the user was deleted',
  })
  deletedAt?: Date | null;

  constructor(user: Users) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.createdDate = user.createdDate;
    this.updatedDate = user.updatedDate;
    this.deletedAt = user.deletedAt;
  }
}
