import { Role } from '../../common/enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Notifications } from '../../notifications/entities/notification.entity';

@Entity()
export class Users {
  @ApiProperty({ example: 'bc43c059-d497-4296-8310-cff0483d38ba', description: 'The unique identifier of the user' })
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
    select: false,
  })
  password: string;

  @ApiProperty({
    example: 'user',
    description: 'The role of the user',
  })
  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: string;

  @OneToMany(() => Notifications, (notification) => notification.userId)
  notifications: Notifications[];

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
      this.role = user.role;
      this.createdDate = user.createdDate;
      this.updatedDate = user.updatedDate;
      this.deletedAt = user.deletedAt || null;
    }
  }
}
