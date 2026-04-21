import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationStatus } from '../enums/notification-status.enum';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiProperty({
    example: 'Pending',
    description: 'The status of the notification',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(NotificationStatus)
  status: NotificationStatus;
}
