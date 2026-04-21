import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { SendResult } from './interfaces/notification-provider.interface';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import type { ActiveUserInterface } from '@/common/interfaces/active-user.interface'; 

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Post()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @ActiveUser() activeUser: ActiveUserInterface,
  ): Promise<SendResult> {
    console.log('activeUser.id',activeUser.id);
    return this.notificationsService.create(createNotificationDto, activeUser.id);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
