import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcryptjs from "bcryptjs";
import { Users } from "../src/users/entities/user.entity";
import { Role } from "../src/common/enum/role.enum";

export class AddedUserAdmin1776224713869 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcryptjs.hash("admin123", 10);
        await queryRunner.manager.insert(Users, {
            name: "Admin User",
            email: "admin@admin.com",
            password: hashedPassword,
            role: Role.ADMIN,
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(Users, { email: "admin@admin.com" });
    }

}
