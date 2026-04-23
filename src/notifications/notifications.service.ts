import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { NotificationProviderFactory } from './providers/provider.factory';
import { SendResult } from './interfaces/notification-provider.interface';
import {
  CreateNotificationDto,
  RespondNotificationDto,
  UpdateNotificationDto,
} from './dto';
import { Notifications } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationsRepository,
    private readonly notificationProviderFactory: NotificationProviderFactory,
  ) { }

  async create(
    createNotificationDto: CreateNotificationDto,
    userId: string,
  ): Promise<SendResult> {
    try {
      const provider = await this.notificationProviderFactory.getProvider(
        createNotificationDto.channel,
      );

      const providerSend = await provider.send(
        createNotificationDto.recipient,
        createNotificationDto.content,
      );

      if (!providerSend.success) {
        throw new BadRequestException(providerSend.message);
      }

      await this.notificationRepository.create(createNotificationDto, userId);

      return providerSend;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new Error(`Error inesperado: ${error.message}`);
    }
  }

  async findAll(userId: string): Promise<Notifications[]> {
    const notifications =
      await this.notificationRepository.findAllByUser(userId);
    return notifications;
  }

  async findOne(id: string, userId: string): Promise<Notifications> {
    const notification = await this.notificationRepository.findOne(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if(notification.userId !== userId){
      throw new BadRequestException('You are not authorized to access this notification');
    }
  
    return notification;
  }


  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return await this.notificationRepository.update(id, updateNotificationDto);
  }

  async remove(id: string) {
    return await this.notificationRepository.delete(id);
  }
}
