import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/index';
import { UpdateResult } from 'typeorm/browser';


@Injectable()
export class NotificationsRepository {
    constructor(
        @InjectRepository(Notifications)
        private readonly notificationRepository: Repository<Notifications>,
    ) { }

    async create(createNotificationDto: CreateNotificationDto, userId: string): Promise<Notifications> {
        const notification = this.notificationRepository.create({ ...createNotificationDto, userId });
        return await this.notificationRepository.save(notification);
    }

    async findAllByUser(userId: string): Promise<Notifications[]> {
        return await this.notificationRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }

    async findById(id: string, userId: string): Promise<Notifications | null> {
        return await this.notificationRepository.findOne({ where: { id, userId } });
    }

    async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notifications | null> {
        await this.notificationRepository.update(id, updateNotificationDto);
        return await this.notificationRepository.findOneBy({ id });
    }

    async delete(id: string): Promise<UpdateResult> {
        return await this.notificationRepository.softDelete(id);
    }

}
