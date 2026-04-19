import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationsTable1776488586047 implements MigrationInterface {
    name = 'AddNotificationsTable1776488586047'

    public async up(queryRunner: QueryRunner): Promise<void> {

        const enumChannelExists = await queryRunner.query(`
        SELECT 1 FROM pg_type WHERE typname = 'notifications_channel_enum'`);
        if (enumChannelExists.length === 0) {
            await queryRunner.query(`CREATE TYPE "public"."notifications_channel_enum" AS ENUM('email', 'sms', 'push')`);
        }

        const enumStatusExists = await queryRunner.query(`
        SELECT 1 FROM pg_type WHERE typname = 'notifications_status_enum'`);
        if (enumStatusExists.length === 0) {
            await queryRunner.query(`CREATE TYPE "public"."notifications_status_enum" AS ENUM('pending', 'sent', 'failed')`);
        }

        await queryRunner.query(`
            CREATE TABLE "notifications" (
              "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
              "title" character varying(255) NOT NULL, 
              "content" character varying(255) NOT NULL, 
              "channel" "public"."notifications_channel_enum" NOT NULL, 
              "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'pending', 
              "recipient" character varying(100) NOT NULL, 
              "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
              "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
              "deletedAt" TIMESTAMP, 
              CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_channel_enum"`);
    }

}
