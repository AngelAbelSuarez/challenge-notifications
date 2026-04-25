jest.setTimeout(60000);
import {
  TestAppContext,
  initTestApp,
  resetTestApp,
  closeTestApp,
} from './helpers/test-app.helper';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../src/users/entities/user.entity';
import request from 'supertest';
import {
  idUserNotFound,
  userData,
  userData2,
  tokenUser,
  loginUser,
  loginUser2,
  tokenUser2,
} from './mocks/users.mock';
import { RespondUserDto } from '../src/users/dto';
import * as bcryptjs from 'bcryptjs';
import { Notifications } from '@/notifications/entities/notification.entity';
import {
  notificationEmailData,
  notificationNotFound,
  notificationPushData,
  notificationSMSData,
  updateNotificationData,
} from './mocks/notifications.mock';
import { SendResult } from '@/notifications/interfaces/notification-provider.interface';
import { RespondNotificationDto } from '@/notifications/dto';

interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

describe('NotificationsController (e2e)', () => {
  let testContext: TestAppContext;
  let app: INestApplication;
  let usersRepository: Repository<Users>;
  let notificationsRepository: Repository<Notifications>;

  beforeAll(async () => {
    testContext = await initTestApp();
    app = testContext.app;
    usersRepository = testContext.usersRepository;
    notificationsRepository = testContext.notificationsRepository;
  });

  afterAll(async () => {
    await closeTestApp(testContext);
  });

  beforeEach(async () => {
    await resetTestApp(testContext);
    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    const userCreated = usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await usersRepository.save(userCreated);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      });

    await loginUser(loginResponse.body.token);

    const hashedPassword2 = await bcryptjs.hash(userData2.password, 10);
    const userCreated2 = usersRepository.create({
      ...userData2,
      password: hashedPassword2,
    });

    await usersRepository.save(userCreated2);

    const loginResponse2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userData2.email,
        password: userData2.password,
      });

    await loginUser2(loginResponse2.body.token);
  });

  describe('POST /notifications', () => {
    it('It should respond status 201 code when creating a notification type email successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send(notificationEmailData)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(201);

      const body = response.body as SendResult;
      expect(body.success).toBe(true);
      expect(body.message).toBe('Email sent successfully');
      expect(body.metadata).toHaveProperty('recipient');
      expect(body.metadata).toHaveProperty('template');
      expect(body.metadata).toHaveProperty('sentAt');
    });

    it('It should respond status 201 code when creating a notification type SMS successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send(notificationSMSData)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(201);

      const body = response.body as SendResult;
      expect(body.success).toBe(true);
      expect(body.message).toBe('SMS sent successfully');
      expect(body.metadata).toHaveProperty('recipient');
      expect(body.metadata).toHaveProperty('sentAt');
    });

    it('It should respond status 201 code when creating a notification type Push successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send(notificationPushData)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(201);

      const body = response.body as SendResult;
      expect(body.success).toBe(true);
      expect(body.message).toBe('Push notification sent successfully');
      expect(body.metadata).toHaveProperty('recipient');
      expect(body.metadata).toHaveProperty('sentAt');
    });

    it('It should respond status 400 code when data is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send({
          title: 'Short',
          content: 'Too short',
          channel: 'invalid-channel',
          recipient: '',
        })
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.error).toBe('Bad Request');
      expect(Array.isArray(body.message)).toBe(true);
    });

    it('It should respond status 400 code when the title is null', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send({ ...notificationSMSData, title: null })
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.error).toBe('Bad Request');
      expect(Array.isArray(body.message)).toBe(true);
      expect(body.message).toContain(
        'title must be shorter than or equal to 20 characters',
      );
      expect(body.message).toContain('title must be a string');
    });

    it('It should respond status 400 code when the content is null', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send({ ...notificationSMSData, content: null })
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.error).toBe('Bad Request');
      expect(Array.isArray(body.message)).toBe(true);
      expect(body.message).toContain(
        'content must be longer than or equal to 20 characters',
      );
      expect(body.message).toContain('content must be a string');
      expect(body.message).toContain('content should not be empty');
    });

    it('It should respond status 400 code when the channel is null', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send({ ...notificationSMSData, channel: null })
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.error).toBe('Bad Request');
      expect(Array.isArray(body.message)).toBe(true);
      expect(body.message).toContain(
        'channel must be one of the following values: email, sms, push',
      );
      expect(body.message).toContain('channel should not be empty');
    });

    it('It should respond status 400 code when the recipient is null', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send({ ...notificationSMSData, recipient: null })
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.error).toBe('Bad Request');
      expect(Array.isArray(body.message)).toBe(true);
      expect(body.message).toContain('recipient must be a string');
      expect(body.message).toContain('recipient should not be empty');
    });

    it('It should respond status 400 code when the recipient is not an email validate', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send({ ...notificationEmailData, recipient: 'invalid-email' })
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.error).toBe('Bad Request');
      expect(Array.isArray(body.message)).toBe(false);
      expect(body.message).toContain('Invalid email format');
    });

    it('It should respond status 400 code when the recipient is not a phone number validate', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send({ ...notificationSMSData, recipient: 'invalid-phone' })
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.error).toBe('Bad Request');
      expect(Array.isArray(body.message)).toBe(false);
      expect(body.message).toContain('Invalid phone number format');
    });

    it('It should respond status 400 code when the recipient is not a push token validate', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send({ ...notificationPushData, recipient: 'invalid-push' })
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.error).toBe('Bad Request');
      expect(Array.isArray(body.message)).toBe(false);
      expect(body.message).toContain(
        'Invalid device token, must be 32 hex characters',
      );
    });

    it('It should respond status 401 code when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send(notificationEmailData)
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Token not found');
      expect(body.error).toBe('Unauthorized');
    });
  });

  describe('GET ALL /notifications', () => {
    it('It should respond status 200 code when get all notifications successfully', async () => {
      await request(app.getHttpServer())
        .post('/notifications')
        .send(notificationEmailData)
        .set('Authorization', `Bearer ${tokenUser}`);

      const response = await request(app.getHttpServer())
        .get('/notifications')
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(200);

      const body = response.body as Notifications[];
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('title');
      expect(body[0]).toHaveProperty('content');
      expect(body[0]).toHaveProperty('channel');
      expect(body[0]).toHaveProperty('recipient');
      expect(body[0]).toHaveProperty('status');
      expect(body[0]).toHaveProperty('userId');
      expect(body[0]).toHaveProperty('createdAt');
      expect(body[0]).toHaveProperty('updatedAt');
      expect(body[0]).toHaveProperty('deletedAt');
    });

    it('It should respond status 401 code when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/notifications')
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Token not found');
      expect(body.error).toBe('Unauthorized');
    });
  });

  describe('GET ONE /notifications', () => {
    it('It should respond status 200 code when get by id notification successfully', async () => {
      await request(app.getHttpServer())
        .post('/notifications')
        .send(notificationEmailData)
        .set('Authorization', `Bearer ${tokenUser}`);

      const getAllNotifications = await request(app.getHttpServer())
        .get('/notifications')
        .set('Authorization', `Bearer ${tokenUser}`);

      const id = getAllNotifications.body[0].id;

      const response = await request(app.getHttpServer())
        .get(`/notifications/${id}`)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(200);

      const body = response.body as Notifications;
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('title');
      expect(body).toHaveProperty('content');
      expect(body).toHaveProperty('channel');
      expect(body).toHaveProperty('recipient');
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('userId');
      expect(body).toHaveProperty('createdAt');
      expect(body).toHaveProperty('updatedAt');
      expect(body).toHaveProperty('deletedAt');
    });

    it('It should respond status 400 code when the id is not valid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/notifications/123`)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Invalid id format');
      expect(body.error).toBe('Bad Request');
    });

    it('It should respond status 401 code when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get(`/notifications/${notificationNotFound}`)
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Token not found');
      expect(body.error).toBe('Unauthorized');
    });

    it('It should respond status 404 code when the notification is not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/notifications/${notificationNotFound}`)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(404);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Notification not found');
      expect(body.error).toBe('Not Found');
    });

    it('It should respond status 404 code when the  id notification is not from the user', async () => {
      await request(app.getHttpServer())
        .post('/notifications')
        .send(notificationEmailData)
        .set('Authorization', `Bearer ${tokenUser}`);

      const getAllNotifications = await request(app.getHttpServer())
        .get('/notifications')
        .set('Authorization', `Bearer ${tokenUser}`);

      const id = getAllNotifications.body[0].id;

      const response = await request(app.getHttpServer())
        .get(`/notifications/${id}`)
        .set('Authorization', `Bearer ${tokenUser2}`)
        .expect(404);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Notification not found');
      expect(body.error).toBe('Not Found');
    });

    describe('PATCH /notifications', () => {
      it('It should respond status 200 code when update successfully', async () => {
        await request(app.getHttpServer())
          .post('/notifications')
          .send(notificationEmailData)
          .set('Authorization', `Bearer ${tokenUser}`);

        const getAllNotifications = await request(app.getHttpServer())
          .get('/notifications')
          .set('Authorization', `Bearer ${tokenUser}`);

        const id = getAllNotifications.body[0].id;

        const response = await request(app.getHttpServer())
          .patch(`/notifications/${id}`)
          .send(updateNotificationData)
          .set('Authorization', `Bearer ${tokenUser}`)
          .expect(200);

        const body = response.body as Notifications;
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('content');
        expect(body).toHaveProperty('channel');
        expect(body).toHaveProperty('recipient');
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('userId');
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
        expect(body).toHaveProperty('deletedAt');
      });

      it('It should respond status 400 code when the id is not valid', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/notifications/123`)
          .send(updateNotificationData)
          .set('Authorization', `Bearer ${tokenUser}`)
          .expect(400);

        const body = response.body as ErrorResponse;
        expect(body.message).toBe('Invalid id format');
        expect(body.error).toBe('Bad Request');
      });

      it('It should respond status 400 code when the channel cannot be changed', async () => {
        await request(app.getHttpServer())
          .post('/notifications')
          .send(notificationEmailData)
          .set('Authorization', `Bearer ${tokenUser}`);

        const getAllNotifications = await request(app.getHttpServer())
          .get('/notifications')
          .set('Authorization', `Bearer ${tokenUser}`);

        const id = getAllNotifications.body[0].id;

        const response = await request(app.getHttpServer())
          .patch(`/notifications/${id}`)
          .send({ ...updateNotificationData, channel: 'sms' })
          .set('Authorization', `Bearer ${tokenUser}`)
          .expect(400);

        const body = response.body as ErrorResponse;
        expect(body.message).toBe('Channel cannot be changed');
        expect(body.error).toBe('Bad Request');
      });

      it('It should respond status 401 code when no token is provided', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/notifications/${notificationNotFound}`)
          .send(updateNotificationData)
          .expect(401);

        const body = response.body as ErrorResponse;
        expect(body.message).toBe('Token not found');
        expect(body.error).toBe('Unauthorized');
      });

      it('It should respond status 404 code when the id notification is not found', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/notifications/${notificationNotFound}`)
          .send(updateNotificationData)
          .set('Authorization', `Bearer ${tokenUser}`)
          .expect(404);

        const body = response.body as ErrorResponse;
        expect(body.message).toBe('Notification not found');
        expect(body.error).toBe('Not Found');
      });

      it('It should respond status 404 code when the id notification is not from the user', async () => {
        await request(app.getHttpServer())
          .post('/notifications')
          .send(notificationEmailData)
          .set('Authorization', `Bearer ${tokenUser}`);

        const getAllNotifications = await request(app.getHttpServer())
          .get('/notifications')
          .set('Authorization', `Bearer ${tokenUser}`);

        const id = getAllNotifications.body[0].id;

        const response = await request(app.getHttpServer())
          .patch(`/notifications/${id}`)
          .set('Authorization', `Bearer ${tokenUser2}`)
          .expect(404);

        const body = response.body as ErrorResponse;
        expect(body.message).toBe('Notification not found');
        expect(body.error).toBe('Not Found');
      });
    });
  });
});
