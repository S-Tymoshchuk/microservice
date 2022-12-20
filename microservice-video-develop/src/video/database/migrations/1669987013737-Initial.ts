import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1669987013737 implements MigrationInterface {
  name = 'Initial1669987013737';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."category_name_enum" AS ENUM('Comedy', 'Music', 'Bitcoin', 'V-log', 'Podcasts', 'Gaming', 'Home Improvements', 'Outfit of the day', 'Sports', 'Travel')`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" "public"."category_name_enum" NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "video_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "videoId" uuid NOT NULL, "userId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.332Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.332Z"', CONSTRAINT "PK_a42e3ed96dcdff025f885914b31" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."video_reaction_type_enum" AS ENUM('like', 'dislike')`,
    );
    await queryRunner.query(
      `CREATE TABLE "video_reaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."video_reaction_type_enum" NOT NULL, "videoId" uuid NOT NULL, "userId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.348Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.348Z"', CONSTRAINT "PK_504876585c394f4ab33665dd44b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "video_views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "videoId" uuid NOT NULL, "userId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.361Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.361Z"', CONSTRAINT "PK_ff495d570215fc8f915a4c8dd08" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."video_report_reason_enum" AS ENUM('reason1', 'reason2', 'reason3', 'reason4', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "video_report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" "public"."video_report_reason_enum" NOT NULL, "videoId" uuid NOT NULL, "description" character varying, "userId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.376Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.376Z"', CONSTRAINT "PK_8b2da2e3f8be163aa2ed6664a7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "video_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying, "quality720" character varying, "quality1080" character varying, "isTransform" boolean NOT NULL DEFAULT false, "hashVideo" character varying, "title" character varying, "ownerId" character varying, "duration" integer, "isPinned" boolean NOT NULL DEFAULT false, "view" integer NOT NULL DEFAULT '0', "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.376Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.376Z"', CONSTRAINT "PK_a86a8f20977e8900f5f6dc4add6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "video_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "videoId" uuid NOT NULL, "text" character varying NOT NULL, "userId" character varying NOT NULL, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.377Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.377Z"', CONSTRAINT "PK_bfe25ab13a4b2e47a3da9b3302a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "video_comments_likes_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "commentId" uuid NOT NULL, "userId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.377Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-02T13:16:57.377Z"', CONSTRAINT "PK_5b356078ecc3f7a944ad9dd2b3f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "video_entity_categories_category" ("videoEntityId" uuid NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_6381c45a4cb32cd2f8196a91964" PRIMARY KEY ("videoEntityId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b6e2a212d58936245baedabed" ON "video_entity_categories_category" ("videoEntityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6169a82dd9501123bfd378f11" ON "video_entity_categories_category" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "video_history" ADD CONSTRAINT "FK_1198bd14c2bdb847581a7760221" FOREIGN KEY ("videoId") REFERENCES "video_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_reaction" ADD CONSTRAINT "FK_448a3f71c13fb3b0f6cdb2df6b8" FOREIGN KEY ("videoId") REFERENCES "video_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_views" ADD CONSTRAINT "FK_cd719d84992eee5ac1bdd9e5f3b" FOREIGN KEY ("videoId") REFERENCES "video_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_report" ADD CONSTRAINT "FK_062d7066767abeb7555aeebafcd" FOREIGN KEY ("videoId") REFERENCES "video_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments" ADD CONSTRAINT "FK_2ba4e7417c624e7112b5fff0021" FOREIGN KEY ("videoId") REFERENCES "video_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments_likes_entity" ADD CONSTRAINT "FK_d7640c10abc29dcff6d81990ed4" FOREIGN KEY ("commentId") REFERENCES "video_comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_entity_categories_category" ADD CONSTRAINT "FK_9b6e2a212d58936245baedabed3" FOREIGN KEY ("videoEntityId") REFERENCES "video_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_entity_categories_category" ADD CONSTRAINT "FK_e6169a82dd9501123bfd378f116" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "video_entity_categories_category" DROP CONSTRAINT "FK_e6169a82dd9501123bfd378f116"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_entity_categories_category" DROP CONSTRAINT "FK_9b6e2a212d58936245baedabed3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments_likes_entity" DROP CONSTRAINT "FK_d7640c10abc29dcff6d81990ed4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments" DROP CONSTRAINT "FK_2ba4e7417c624e7112b5fff0021"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_report" DROP CONSTRAINT "FK_062d7066767abeb7555aeebafcd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_views" DROP CONSTRAINT "FK_cd719d84992eee5ac1bdd9e5f3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_reaction" DROP CONSTRAINT "FK_448a3f71c13fb3b0f6cdb2df6b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_history" DROP CONSTRAINT "FK_1198bd14c2bdb847581a7760221"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e6169a82dd9501123bfd378f11"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9b6e2a212d58936245baedabed"`,
    );
    await queryRunner.query(`DROP TABLE "video_entity_categories_category"`);
    await queryRunner.query(`DROP TABLE "video_comments_likes_entity"`);
    await queryRunner.query(`DROP TABLE "video_comments"`);
    await queryRunner.query(`DROP TABLE "video_entity"`);
    await queryRunner.query(`DROP TABLE "video_report"`);
    await queryRunner.query(`DROP TYPE "public"."video_report_reason_enum"`);
    await queryRunner.query(`DROP TABLE "video_views"`);
    await queryRunner.query(`DROP TABLE "video_reaction"`);
    await queryRunner.query(`DROP TYPE "public"."video_reaction_type_enum"`);
    await queryRunner.query(`DROP TABLE "video_history"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TYPE "public"."category_name_enum"`);
  }
}
