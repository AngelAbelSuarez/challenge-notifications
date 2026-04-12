import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    example: 'strongpassword123',
    description: 'The password of the user',
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  password: string;

  @ApiProperty({
    example: new Date(),
    description: 'The date when the user was created',
  })
  @CreateDateColumn()
  createdDate: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The date when the user was updated',
  })
  @UpdateDateColumn()
  updatedDate: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The date when the user was deleted',
  })
  @DeleteDateColumn()
  deletedAt?: Date | null;

  constructor(user?: Users) {
    if (user) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.password = user.password;
      this.createdDate = user.createdDate;
      this.updatedDate = user.updatedDate;
      this.deletedAt = user.deletedAt || null;
    }
  }
}
