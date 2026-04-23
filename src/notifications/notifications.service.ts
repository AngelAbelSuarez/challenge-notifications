import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationProviderFactory } from './providers/provider.factory';
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

  // async findAll(userId: string): Promise<Notifications[]> {
  //   const notifications = await this.notificationRepository.findAllByUser(userId);
  //   return notifications;
  // }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  // async updateNotifications (updateNotificationDto: UpdateNotificationDto, userId: string ) {

  // }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
