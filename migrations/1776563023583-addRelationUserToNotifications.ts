import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationUserToNotifications1776563023583 implements MigrationInterface {
    name = 'AddRelationUserToNotifications1776563023583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notifications" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`
            ALTER TABLE "notifications" ADD 
            CONSTRAINT "FK_users_id" FOREIGN KEY ("userId") REFERENCES 
            "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_users_id"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "userId"`);
    }

}
