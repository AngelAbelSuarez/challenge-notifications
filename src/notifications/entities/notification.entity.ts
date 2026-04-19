import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelType } from '../enums/channel-type.enum';
import { Users } from '../../users/entities/user.entity';
import { NotificationStatus } from '../enums/notification-status.enum';

@Entity()
export class Notifications {
  @ApiProperty({
    example: 'bc43c059-d497-4296-8310-cff0483d38ba',
    description: 'The unique identifier of the notification',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Welcome to our platform',
    description: 'The title of the notification',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @ApiProperty({
    example: 'Hello, welcome to our platform',
    description: 'The content of the notification',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  content: string;

  @ApiProperty({
    example: 'Email',
    description: 'The channel of the notification',
  })
  @Column({
    type: 'enum',
    enum: ChannelType,
    nullable: false,
  })
  channel: ChannelType;

  @ApiProperty({
    example: 'Pending',
    description: 'The status of the notification',
  })
  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @ApiProperty({
    example: '[EMAIL_ADDRESS]',
    description: 'The recipient of the notification',
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  recipient: string;

  @ManyToOne(() => Users, (user) => user.notifications)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ApiProperty({
    example: '5a262baf-2596-43bd-b943-2ef2b922f0e4',
    description: 'The user ID of the notification',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @ApiProperty({
    example: new Date(),
    description: 'The date when the notification was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The date when the notification was updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The date when the notification was deleted',
  })
  @DeleteDateColumn()
  deletedAt?: Date | null;

  constructor(notification?: Notifications) {
    if (notification) {
      this.id = notification.id;
      this.title = notification.title;
      this.content = notification.content;
      this.channel = notification.channel;
      this.recipient = notification.recipient;
      // this.userId = notification.userId;
      this.createdAt = notification.createdAt;
      this.updatedAt = notification.updatedAt;
      this.deletedAt = notification.deletedAt || null;
    }
  }
}
