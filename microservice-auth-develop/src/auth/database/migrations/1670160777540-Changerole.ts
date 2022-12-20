import { MigrationInterface, QueryRunner } from "typeorm";

export class Changerole1670160777540 implements MigrationInterface {
    name = 'Changerole1670160777540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "roleId" TO "role"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Admin', 'User')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '"2022-12-04T13:33:01.146Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '"2022-12-04T13:33:01.146Z"'`);
        await queryRunner.query(`ALTER TABLE "user_followers" ALTER COLUMN "createdAt" SET DEFAULT '"2022-12-04T13:33:01.147Z"'`);
        await queryRunner.query(`ALTER TABLE "user_followers" ALTER COLUMN "updatedAt" SET DEFAULT '"2022-12-04T13:33:01.147Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_followers" ALTER COLUMN "updatedAt" SET DEFAULT '2022-12-02 12:55:38.147'`);
        await queryRunner.query(`ALTER TABLE "user_followers" ALTER COLUMN "createdAt" SET DEFAULT '2022-12-02 12:55:38.147'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2022-12-02 12:55:38.146'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2022-12-02 12:55:38.146'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "role" TO "roleId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
