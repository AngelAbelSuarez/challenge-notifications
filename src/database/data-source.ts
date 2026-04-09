import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config(); // Ensure variables are loaded if not using dotenv-cli

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_DB_PORT || '5432', 10),
  username: process.env.POSTGRES_DB_USER || 'postgres',
  password: process.env.POSTGRES_DB_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB_DATABASE || 'usersdb',
  synchronize: process.env.DATABASE_SYNC === 'true',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [
    join(__dirname, '../../migrations/*.{ts,js}'),
    join(__dirname, '../../seed-migrations/*.{ts,js}'),
  ],

  migrationsTableName: 'migrations_table',
});
