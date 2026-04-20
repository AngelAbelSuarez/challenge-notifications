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
  adminData,
  loginAdmin,
  tokenAdmin,
} from './mocks/users.mock';
import { RespondUserDto } from '../src/users/dto';
import { Role } from '../src/common/enum/role.enum';
import * as bcryptjs from 'bcryptjs';

interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

describe('UsersController (e2e)', () => {
  let testContext: TestAppContext;
  let app: INestApplication;
  let usersRepository: Repository<Users>;

  beforeAll(async () => {
    testContext = await initTestApp();
    app = testContext.app;
    usersRepository = testContext.usersRepository;

    const hashedPassword = await bcryptjs.hash(adminData.password, 10);
    const adminUser = usersRepository.create({
      ...adminData,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    await usersRepository.save(adminUser);

    const loginResponse = await request(testContext.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: adminData.email,
        password: adminData.password,
      });

    loginAdmin(loginResponse.body.token);
  });

  afterAll(async () => {
    await closeTestApp(testContext);
  });

  beforeEach(async () => {
    await resetTestApp(testContext);
  });

  describe('POST /users', () => {
    it('It should respond status 201 code when creating a user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(201);

      const body = response.body as RespondUserDto;
      expect(body.id).toBeDefined();
      expect(body.name).toBe('newuser');
      expect(body.email).toBe('new@example.com');
      expect(body).not.toHaveProperty('password');
      expect(body).toHaveProperty('createdDate');
      expect(body).toHaveProperty('updatedDate');
      expect(body).toHaveProperty('deletedAt');
    });

    it('It should respond status 400 code when the request body is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({})
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.message).toContain('name must be a string');
      expect(body.message).toContain('name should not be empty');
      expect(body.message).toContain('email must be an email');
      expect(body.message).toContain('email must be a string');
      expect(body.message).toContain('email should not be empty');
      expect(body.message).toContain('password must be a string');
      expect(body.message).toContain('password should not be empty');
      expect(body.error).toBe('Bad Request');
      expect(body.statusCode).toBe(400);
    });

    it('It should return status 400 code when the name is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...userData, name: null })
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.message).toContain('name must be a string');
      expect(body.message).toContain('name should not be empty');
      expect(body.error).toBe('Bad Request');
      expect(body.statusCode).toBe(400);
    });

    it('It should return status 400 code when the name is an empty string', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...userData, name: '' })
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.message).toContain(
        'name must be longer than or equal to 3 characters',
      );
      expect(body.message).toContain('name should not be empty');
      expect(body.statusCode).toBe(400);
    });

    it('It should return status 400 code when the email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...userData, email: null })
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.message).toContain('email must be an email');
      expect(body.message).toContain('email must be a string');
      expect(body.message).toContain('email should not be empty');
      expect(body.statusCode).toBe(400);
    });

    it('It should return status 400 code when the email is an empty string', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...userData, email: '' })
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.message).toContain('email must be an email');
      expect(body.message).toContain('email should not be empty');
      expect(body.statusCode).toBe(400);
    });

    it('It should return status 400 code when the email has invalid format', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...userData, email: 'invalid-email' })
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.message).toContain('email must be an email');
      expect(body.statusCode).toBe(400);
    });

    it('It should return status 400 code when the password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...userData, password: undefined })
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.message).toContain('password should not be empty');
      expect(body.message).toContain(
        'password must be longer than or equal to 12 characters',
      );
      expect(body.statusCode).toBe(400);
    });

    it('It should return status 400 code when the password is an empty string', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...userData, password: '' })
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.message).toContain(
        'password must be longer than or equal to 12 characters',
      );
      expect(body.message).toContain('password should not be empty');
      expect(body.statusCode).toBe(400);
    });

    it('It should return status 400 code when the password has less than 12 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...userData, password: 'short' })
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body.message).toContain(
        'password must be longer than or equal to 12 characters',
      );
      expect(body.statusCode).toBe(400);
    });

    it('It should respond status 401 code when no authentication ', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Token not found');
      expect(body.error).toBe('Unauthorized');
      expect(body.statusCode).toBe(401);
    });

    it('It should respond status 403 code when the user is not admin', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`);

      const loginResponse = await request(testContext.app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      const tokenUser = loginResponse.body.token;

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(403);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Forbidden resource');
      expect(body.error).toBe('Forbidden');
      expect(body.statusCode).toBe(403);
    });

    it('It should respond status 409 code when the email already exists', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(409);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Email already exists');
      expect(body.error).toBe('Conflict');
      expect(body.statusCode).toBe(409);
    });
  });

  describe('GET /users', () => {
    it('It should respond status 200 code when listing users successfully', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200);

      const body = response.body as RespondUserDto[];
      expect(body).toBeDefined();
      expect(body).toBeInstanceOf(Array);
      expect(body.length).toBe(1);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('name');
      expect(body[0]).toHaveProperty('email');
      expect(body[0].name).toBe('newuser');
      expect(body[0].email).toBe('new@example.com');
    });

    it('It should respond status 401 code when no authentication to list user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Token not found');
      expect(body.error).toBe('Unauthorized');
      expect(body.statusCode).toBe(401);
    });

    it('It should respond status 403 code when not authorized to list user', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`);

      const loginResponse = await request(testContext.app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      const tokenUser = loginResponse.body.token;

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(403);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Forbidden resource');
      expect(body.error).toBe('Forbidden');
      expect(body.statusCode).toBe(403);
    });
  });

  describe('GET /users/:id', () => {
    it('It should respond status 200 code when getting a user successfully', async () => {
      const createdUser = await request(app.getHttpServer())
        .post('/users')
        .send(userData2)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(201);
      const userId = (createdUser.body as { id: string }).id;
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200);

      const body = response.body as RespondUserDto;
      expect(body).toBeDefined();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('email');
      expect(body.name).toBe('newuser2');
      expect(body.email).toBe('new2@example.com');
    });

    it('It should respond status 400 code when getting a user with invalid id format', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/invalid-id`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.statusCode).toBe(400);
      expect(body.error).toBe('Bad Request');
      expect(body.message).toContain('Validation failed');
    });

    it('It should respond status 401 code when not authorized to get user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Token not found');
      expect(body.error).toBe('Unauthorized');
      expect(body.statusCode).toBe(401);
    });

    it('It should respond status 403 code when the user is not admin', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`);

      const loginResponse = await request(testContext.app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      const tokenUser = loginResponse.body.token;

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(403);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Forbidden resource');
      expect(body.error).toBe('Forbidden');
      expect(body.statusCode).toBe(403);
    });

    it('It should respond status 404 code when getting a user that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${idUserNotFound}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(404);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe(`User with id ${idUserNotFound} not found`);
      expect(body.error).toBe('Not Found');
      expect(body.statusCode).toBe(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('It should respond status 200 code when updating a user successfully', async () => {
      const createdUser = await request(app.getHttpServer())
        .post('/users')
        .send(userData2)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(201);
      const userId = (createdUser.body as { id: string }).id;
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(userData2)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200);

      const body = response.body as RespondUserDto;
      expect(body).toBeDefined();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('email');
    });

    it('It should respond status 400 code when updating a user with invalid id format', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/invalid-id`)
        .send(userData2)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.statusCode).toBe(400);
      expect(body.error).toBe('Bad Request');
      expect(body.message).toContain('Validation failed');
    });

    it('It should respond status 400 code when updating a user with invalid body', async () => {
      const createdUser = await request(app.getHttpServer())
        .post('/users')
        .send(userData2)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(201);
      const userId = (createdUser.body as { id: string }).id;
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ email: 'not-an-email' })
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.message).toContain('email must be an email');
      expect(body.error).toBe('Bad Request');
      expect(body.statusCode).toBe(400);
    });

    it('It should respond status 401 code when not authenticated to update user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Token not found');
      expect(body.error).toBe('Unauthorized');
      expect(body.statusCode).toBe(401);
    });

    it('It should respond status 403 code when not authorized to update user', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`);

      const loginResponse = await request(testContext.app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      const tokenUser = loginResponse.body.token;

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(403);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Forbidden resource');
      expect(body.error).toBe('Forbidden');
      expect(body.statusCode).toBe(403);
    });

    it('It should respond status 404 code when updating a user that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${idUserNotFound}`)
        .send(userData2)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(404);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe(`User with id ${idUserNotFound} not found`);
      expect(body.error).toBe('Not Found');
      expect(body.statusCode).toBe(404);
    });

    it('It should respond status 409 code when updating a user with an email that already exists', async () => {
      const createdUser = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(201);

      await request(app.getHttpServer())
        .post('/users')
        .send(userData2)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(201);
      const userId = (createdUser.body as { id: string }).id;
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ ...userData, email: userData2.email })
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(409);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Email already exists');
      expect(body.error).toBe('Conflict');
      expect(body.statusCode).toBe(409);
    });
  });

  describe('DELETE /users/:id', () => {
    it('It should respond status 200 code when deleting a user successfully', async () => {
      const createdUser = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(201);
      const userId = (createdUser.body as { id: string }).id;
      const response = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200);
      const body = response.body as { message: string; id: string };
      expect(body).toBeDefined();
      expect(body.message).toBe('User deleted successfully');
      expect(body.id).toBe(userId);
    });

    it('It should respond status 400 code when deleting a user with invalid id format', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/invalid-id`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(400);

      const body = response.body as ErrorResponse;
      expect(body.statusCode).toBe(400);
      expect(body.error).toBe('Bad Request');
      expect(body.message).toContain('Validation failed');
    });

    it('It should respond status 401 code when not authenticated to delete user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Token not found');
      expect(body.error).toBe('Unauthorized');
      expect(body.statusCode).toBe(401);
    });

    it('It should respond status 403 code when user is not admin when trying to delete user', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenAdmin}`);

      const loginResponse = await request(testContext.app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      const tokenUser = loginResponse.body.token;

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .set('Authorization', `Bearer ${tokenUser}`)
        .expect(403);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Forbidden resource');
      expect(body.error).toBe('Forbidden');
      expect(body.statusCode).toBe(403);
    });

    it('It should respond 404 code when deleting a user that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${idUserNotFound}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(404);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe(`User with id ${idUserNotFound} not found`);
      expect(body.error).toBe('Not Found');
      expect(body.statusCode).toBe(404);
    });
  });
});
