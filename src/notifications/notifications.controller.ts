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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RespondNotificationDto } from './dto';
import { Notifications } from './entities/notification.entity';

@ApiTags('Notifications')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized Bearer Auth',
})
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new notification',
  })
  @ApiBody({
    type: CreateNotificationDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    schema: {
      example: {
        success: true,
        message: 'Notification created successfully',
        metadata: {
          recipient: 'welcome@email.com',
          template:
            '<html> <body> <h2>Notificación</h2> <p>This is the content of the notification</p> </body> </html>',
          sentAt: '2026-04-23T01:50:11.654Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      example: {
        message: [
          'title must be shorter than or equal to 20 characters',
          'title must be a string',
          'title should not be empty',
          'content must be longer than or equal to 20 characters',
          'content must be a string',
          'content should not be empty',
          'channel must be one of the following values: email, sms, push',
          'channel should not be empty',
          'recipient must be a string',
          'recipient should not be empty',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Bearer Auth',
    schema: {
      example: {
        message: 'Token not found',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        message: 'Internal server error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @ActiveUser() activeUser: ActiveUserInterface,
  ): Promise<SendResult> {
    return this.notificationsService.create(
      createNotificationDto,
      activeUser.id,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all notifications of user',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all notifications.',
    type: [RespondNotificationDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Bearer Auth',
    schema: {
      example: {
        message: 'Token not found',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        message: 'Internal server error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  findAll(
    @ActiveUser() activeUser: ActiveUserInterface,
  ): Promise<Notifications[]> {
    return this.notificationsService.findAll(activeUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by id' })
  @ApiParam({ name: 'id', description: 'Notification id' })
  @ApiResponse({
    status: 200,
    description: 'Return the notification by id of user.',
    type: [Notifications],
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      example: {
        message: ['You are not authorized to access this notification'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Bearer Auth',
    schema: {
      example: {
        message: 'Token not found',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    schema: {
      example: {
        message: 'Notification not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        message: 'Internal server error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  findOne(
    @Param('id') id: string,
    @ActiveUser() activeUser: ActiveUserInterface,
  ): Promise<Notifications> {
    return this.notificationsService.findOne(id, activeUser.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notification' })
  @ApiParam({ name: 'id', description: 'Notification id' })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully updated.',
    type: Notifications,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Bearer Auth',
    schema: {
      example: {
        message: 'Token not found',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        message: 'Internal server error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  update(
    @Param('id') id: string,
    @ActiveUser() activeUser: ActiveUserInterface,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notifications> {
    return this.notificationsService.update(
      id,
      updateNotificationDto,
      activeUser.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
