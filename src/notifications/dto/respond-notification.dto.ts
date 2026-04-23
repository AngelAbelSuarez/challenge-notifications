import { ApiProperty } from '@nestjs/swagger';
import { ChannelType } from '../enums/channel-type.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RespondNotificationDto {
  @ApiProperty({
    example: '4a488157-4198-4489-9c89-859d76ccb060',
    description: 'The unique identifier of the notification',
  })
  id: string;

  @ApiProperty({
    example: 'Hello world',
    description: 'The title of the notification',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  title: string;

  @ApiProperty({
    example: 'This is the content of the notification',
    description: 'The content of the notification',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  content: string;

  @ApiProperty({
    example: ChannelType.EMAIL,
    description: 'The channel of the notification',
    enum: ChannelType,
  })
  @IsNotEmpty()
  @IsEnum(ChannelType)
  channel: ChannelType;

  @ApiProperty({
    example: 'welcome@email.com',
    description: 'The recipient of the notification',
  })
  @IsNotEmpty()
  @IsString()
  recipient: string;

  @ApiProperty({
    example: NotificationStatus.SENT,
    description: 'The status of the notification',
  })
  status: NotificationStatus;

  @ApiProperty({
    example: '4a488157-4198-4489-9c89-859d76ccb060',
    description: 'The unique identifier of the user',
  })
  userId: string;

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

  constructor(notification?: RespondNotificationDto) {
    if (notification) {
      this.id = notification.id;
      this.title = notification.title;
      this.content = notification.content;
      this.channel = notification.channel;
      this.recipient = notification.recipient;
      this.status = notification.status;
      this.createdDate = notification.createdDate;
      this.updatedDate = notification.updatedDate;
      this.deletedAt = notification.deletedAt;
    }
  }
}
