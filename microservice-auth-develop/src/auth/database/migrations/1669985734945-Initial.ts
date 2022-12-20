import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1669985734945 implements MigrationInterface {
    name = 'Initial1669985734945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying, "password" character varying NOT NULL, "birthDate" TIMESTAMP, "bio" character varying, "status" text NOT NULL DEFAULT 'active', "backgroundUrl" character varying, "avatarUrl" character varying, "roleId" uuid NOT NULL, "description" text, "isPrivate" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T12:55:38.146Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T12:55:38.146Z"', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_followers" ("id" SERIAL NOT NULL, "followingId" uuid NOT NULL, "followerId" uuid NOT NULL, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T12:55:38.147Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T12:55:38.147Z"', CONSTRAINT "REL_b319cdc26936df06bca3feb3bc" UNIQUE ("followingId"), CONSTRAINT "REL_c3f56a3157b50bc8adcc6acf27" UNIQUE ("followerId"), CONSTRAINT "PK_ee6ca6c8db6c5e06db7727f08d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_followers" ADD CONSTRAINT "FK_b319cdc26936df06bca3feb3bc2" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_followers" ADD CONSTRAINT "FK_c3f56a3157b50bc8adcc6acf278" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_followers" DROP CONSTRAINT "FK_c3f56a3157b50bc8adcc6acf278"`);
        await queryRunner.query(`ALTER TABLE "user_followers" DROP CONSTRAINT "FK_b319cdc26936df06bca3feb3bc2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP TABLE "user_followers"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
