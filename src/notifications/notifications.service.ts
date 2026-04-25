import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { NotificationProviderFactory } from './providers/provider.factory';
import { SendResult } from './interfaces/notification-provider.interface';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';
import { Notifications } from './entities/notification.entity';
import { isUUID } from 'class-validator';

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
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id format');
    }

    const notification = await this.notificationRepository.findOne(id);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
    userId: string,
  ): Promise<Notifications> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id format');
    }

    const notification = await this.notificationRepository.findOne(id);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    if (updateNotificationDto.channel !== notification.channel) {
      throw new BadRequestException('Channel cannot be changed');
    }

    const provider = await this.notificationProviderFactory.getProvider(
      notification.channel,
    );

    const providerSend = await provider.send(
      updateNotificationDto.recipient ?? notification.recipient,
      updateNotificationDto.content ?? notification.content,
    );

    const updatedNotification = await this.notificationRepository.update(
      id,
      updateNotificationDto,
    );

    if (!updatedNotification) {
      throw new NotFoundException('Notification not found');
    }

    return updatedNotification;
  }

  async remove(id: string) {
    return await this.notificationRepository.delete(id);
  }
}
