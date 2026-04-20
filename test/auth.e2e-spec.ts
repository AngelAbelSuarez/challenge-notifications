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
import { userData, adminData } from './mocks/users.mock';
import { RespondUserDto } from '@/users/dto';

interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

describe('AuthController (e2e)', () => {
  let testContext: TestAppContext;
  let app: INestApplication;
  let usersRepository: Repository<Users>;

  beforeAll(async () => {
    testContext = await initTestApp();
    app = testContext.app;
    usersRepository = testContext.usersRepository;
  });

  afterAll(async () => {
    await closeTestApp(testContext);
  });

  beforeEach(async () => {
    await resetTestApp(testContext);
  });

  describe('POST /auth/register', () => {
    it('It should respond status 201 code when registering a user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);

      const body = response.body as RespondUserDto;
      expect(body.id).toBeDefined();
      expect(body.name).toBe(userData.name);
      expect(body.email).toBe(userData.email);
      expect(body).not.toHaveProperty('password');
      expect(body).toHaveProperty('createdDate');
      expect(body).toHaveProperty('updatedDate');
      expect(body).toHaveProperty('deletedAt');
    });

    it('It should respond status 409 code when the email already exists', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(409);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Email already exists');
      expect(body.error).toBe('Conflict');
      expect(body.statusCode).toBe(409);
    });

    it('It should respond status 400 code when the registration body is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'not-an-email' })
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.error).toBe('Bad Request');
      expect(body.statusCode).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('It should respond status 201 code when logging in successfully', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toBe(userData.email);
    });

    it('It should respond status 401 code when using invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Invalid credentials');
      expect(body.error).toBe('Unauthorized');
      expect(body.statusCode).toBe(401);
    });

    it('It should respond status 401 code when the user does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Invalid credentials');
      expect(body.statusCode).toBe(401);
    });
  });
});
