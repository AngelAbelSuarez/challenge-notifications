import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { Users } from '@/users/entities/user.entity';
import { NotificationsRepository } from './notifications.repository';
import { NotificationProviderFactory } from './providers/provider.factory';
import { EmailProvider } from './providers/email.provider';
import { SmsProvider } from './providers/sms.provider';
import { PushProvider } from './providers/push.provider';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications, Users]), AuthModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsRepository,
    NotificationsService,
    NotificationProviderFactory,
    EmailProvider,
    SmsProvider,
    PushProvider,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
