import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnNotificationStatusToNotificationEntity1776813681374 implements MigrationInterface {
    name = 'ChangeColumnNotificationStatusToNotificationEntity1776813681374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_users_id"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "status" SET DEFAULT 'sent'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_users_id" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
