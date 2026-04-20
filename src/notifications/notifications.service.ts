import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationProviderFactory } from './providers/provider.factory';
import { NotificationStatus } from './enums/notification-status.enum';
import { Notifications } from './entities/notification.entity';
import { SendResult } from './interfaces/notification-provider.interface';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationsRepository,
    private readonly notificationProviderFactory: NotificationProviderFactory,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
    userId: string,
  ): Promise<SendResult> {
    let notification: Notifications | undefined;
    try {
      notification = await this.notificationRepository.create(
        createNotificationDto,
        userId,
      );

      const provider = await this.notificationProviderFactory.getProvider(
        createNotificationDto.channel,
      );

      const providerSend = await provider.send(
        createNotificationDto.recipient,
        createNotificationDto.content,
      );

      await this.notificationRepository.update(notification.id, {
        status: NotificationStatus.SENT,
      });

      return providerSend;
    } catch (error) {
      if (notification?.id) {
        await this.notificationRepository.update(notification.id, {
          status: NotificationStatus.FAILED,
        });
      }
      throw new Error(`Error al enviar la notificación: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
