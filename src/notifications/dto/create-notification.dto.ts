import { ApiProperty } from '@nestjs/swagger';
import { ChannelType } from '../enums/channel-type.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Welcome to our platform',
    description: 'The title of the notification',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'Hello, welcome to our platform',
    description: 'The content of the notification',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  content: string;

  @ApiProperty({
    example: 'Email',
    description: 'The channel of the notification',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ChannelType)
  channel: ChannelType;

  @ApiProperty({
    example: 'Pending',
    description: 'The status of the notification',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(NotificationStatus)
  status: NotificationStatus;

  @ApiProperty({
    example: '[EMAIL_ADDRESS]',
    description: 'The recipient of the notification',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  recipient: string;

  constructor(notification?: CreateNotificationDto) {
    if (notification) {
      this.title = notification.title;
      this.content = notification.content;
      this.channel = notification.channel;
      this.recipient = notification.recipient;
    }
  }
}
