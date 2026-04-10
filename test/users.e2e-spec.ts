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
import { idUserNotFound, userData, userData2 } from './mocks/users.mock';
import { RespondUserDto } from '../src/users/dto';
// import axios from 'axios';

interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

describe('UsersController (e2e)', () => {
  let testContext: TestAppContext;
  let app: INestApplication;
  let usersRepository: Repository<Users>;
  // let axiosGetService: jest.SpyInstance;

  beforeAll(async () => {
    // Inicializar la aplicación de prueba
    testContext = await initTestApp();
    app = testContext.app;
    usersRepository = testContext.usersRepository;

    // axiosGetService = jest.spyOn(axios, 'get');
    // axiosGetService.mockImplementation((url: string) => {
    //   if (url.includes('dragonball-api.com')) {
    //     const id = getDragonBallZIdFromUrl(url);
    //     if (id !== null) {
    //       const data = mockDragonBallZData.find(
    //         (dragonBall) => dragonBall.id === id,
    //       );
    //       return Promise.resolve({ data: data });
    //     }
    //   }
    //   return Promise.reject(new Error(`No mock configured for URL: ${url}`));
    // });
  });

  afterAll(async () => {
    // if (axiosGetService) {
    //   axiosGetService.mockClear();
    // }
    // Limpiar después de todos los tests
    await closeTestApp(testContext);
  });

  beforeEach(async () => {
    //Restaurar spy después de cada test
    await resetTestApp(testContext);
    // if (axiosGetService) {
    //   axiosGetService.mockClear();
    // }
  });

  describe('POST /users', () => {
    it('It should respond with the created user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const body = response.body as RespondUserDto;
      expect(body.id).toBeDefined();
      expect(body.name).toBe('newuser');

      const savedUser = await usersRepository.findOneBy({
        id: body.id,
      });
      expect(savedUser).not.toBeNull();
      expect(savedUser?.name).toBe('newuser');
    });

    it('It should respond with a bad request error if the request body is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(400);
      interface ErrorResponse {
        message: string | string[];
        error: string;
        statusCode: number;
      }

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

    it('It should respond with a conflict error if the email already exists', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(409);

      const body = response.body as ErrorResponse;
      expect(body.message).toBe('Email already exists');
      expect(body.error).toBe('Conflict');
      expect(body.statusCode).toBe(409);
    });
  });

  describe('GET /users', () => {
    it('It should respond 200 code when listing users successfully', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      const body = response.body as RespondUserDto[];
      expect(body).toBeDefined();
      expect(body).toBeInstanceOf(Array);
      expect(body.length).toBe(1);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('name');
      expect(body[0]).toHaveProperty('email');
      expect(body[0]).toHaveProperty('dragonBallZIds');
      expect(body[0].name).toBe('newuser');
      expect(body[0].email).toBe('new@example.com');
    });
  });

  describe('GET /users/:id', () => {
    it('It should respond 200 code when getting a user successfully', async () => {
      const createdUser = await request(app.getHttpServer())
        .post('/users')
        .send(userData2)
        .expect(201);
      const userId = (createdUser.body as { id: string }).id;
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      const body = response.body as RespondUserDto;
      expect(body).toBeDefined();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('email');
      expect(body.name).toBe('newuser2');
      expect(body.email).toBe('new2@example.com');
    });

    describe('PATCH /users/:id', () => {
      it('It should respond 200 code when updating a user successfully', async () => {
        const createdUser = await request(app.getHttpServer())
          .post('/users')
          .send(userData2)
          .expect(201);
        const userId = (createdUser.body as { id: string }).id;
        const response = await request(app.getHttpServer())
          .patch(`/users/${userId}`)
          .send(userData2)
          .expect(200);

        const body = response.body as RespondUserDto;
        expect(body).toBeDefined();
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name');
        expect(body).toHaveProperty('email');
      });

      it('It should respond 404 code when updating a user that does not exist', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/users/${idUserNotFound}`)
          .send(userData2)
          .expect(404);

        const body = response.body as ErrorResponse;
        expect(body.message).toBe(`User with id ${idUserNotFound} not found`);
        expect(body.error).toBe('Not Found');
        expect(body.statusCode).toBe(404);
      });

      it('It should respond 409 code when updating a user with an email that already exists', async () => {
        const createdUser = await request(app.getHttpServer())
          .post('/users')
          .send(userData)
          .expect(201);

        await request(app.getHttpServer())
          .post('/users')
          .send(userData2)
          .expect(201);
        const userId = (createdUser.body as { id: string }).id;
        const response = await request(app.getHttpServer())
          .patch(`/users/${userId}`)
          .send({ ...userData, email: userData2.email })
          .expect(409);

        const body = response.body as ErrorResponse;
        expect(body.message).toBe('Email already exists');
        expect(body.error).toBe('Conflict');
        expect(body.statusCode).toBe(409);
      });
    });

    describe('DELETE /users/:id', () => {
      xit('It should respond 200 code when deleting a user successfully', async () => {
        const createdUser = await request(app.getHttpServer())
          .post('/users')
          .send(userData)
          .expect(201);
        const userId = (createdUser.body as { id: string }).id;
        const response = await request(app.getHttpServer())
          .delete(`/users/${userId}`)
          .expect(200);
        const body = response.body as boolean;
        expect(body).toBeDefined();
        expect(body).toBe(true);
      });

      it('It should respond 404 code when deleting a user that does not exist', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/users/${idUserNotFound}`)
          .expect(404);

        const body = response.body as ErrorResponse;
        expect(body.message).toBe(`User with id ${idUserNotFound} not found`);
        expect(body.error).toBe('Not Found');
        expect(body.statusCode).toBe(404);
      });
    });
  });
});
