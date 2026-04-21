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
    example: 'Hello world',
    description: 'The title of the notification',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'This is the content of the notification',
    description: 'The content of the notification',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
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
