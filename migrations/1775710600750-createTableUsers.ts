import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUsers1775710600750 implements MigrationInterface {
    name = 'CreateTableUsers1775710600750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "name" character varying(100) NOT NULL, 
                "email" character varying(150) NOT NULL, 
                "password" character varying(100) NOT NULL, 
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), 
                "deletedAt" TIMESTAMP, 

                CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
