import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Users } from '../../src/users/entities/user.entity';
import { AppModule } from '../../src/app.module';
import { AuthService } from '@/auth/auth.service';

export interface TestAppContext {
  app: INestApplication;
  dataSource: DataSource;
  usersRepository: Repository<Users>;
}

export async function initTestApp(): Promise<TestAppContext> {
  // Create test module
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  // Override database configuration for tests
  const app = moduleFixture.createNestApplication();
  // Get the DataSource before initializing the app
  const dataSource = moduleFixture.get<DataSource>(DataSource);
  // Drop and recreate the database schema
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Initialize the app
  await app.init();

  const usersRepository = dataSource.getRepository(Users);

  return {
    app,
    dataSource,
    usersRepository,
  };
}

export async function closeTestApp(context: TestAppContext): Promise<void> {
  const { app, dataSource, usersRepository } = context;

  await dataSource.destroy();
  await app.close();
}

export async function resetTestApp(context: TestAppContext): Promise<void> {
  const { dataSource, usersRepository } = context;

  await dataSource.synchronize(true);
}
