import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountReportStatus1670240457817 implements MigrationInterface {
  name = 'AddCountReportStatus1670240457817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."video_entity_status_enum" AS ENUM('reason1', 'Reviewed', 'default')`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_entity" ADD "status" "public"."video_entity_status_enum" NOT NULL DEFAULT 'default'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_history" ALTER COLUMN "createdAt" SET DEFAULT '"2022-12-05T11:41:01.478Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_history" ALTER COLUMN "updatedAt" SET DEFAULT '"2022-12-05T11:41:01.478Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_reaction" ALTER COLUMN "createdAt" SET DEFAULT '"2022-12-05T11:41:01.494Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_reaction" ALTER COLUMN "updatedAt" SET DEFAULT '"2022-12-05T11:41:01.494Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_views" ALTER COLUMN "createdAt" SET DEFAULT '"2022-12-05T11:41:01.507Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_views" ALTER COLUMN "updatedAt" SET DEFAULT '"2022-12-05T11:41:01.507Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_report" ALTER COLUMN "createdAt" SET DEFAULT '"2022-12-05T11:41:01.520Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_report" ALTER COLUMN "updatedAt" SET DEFAULT '"2022-12-05T11:41:01.520Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_entity" ALTER COLUMN "createdAt" SET DEFAULT '"2022-12-05T11:41:01.522Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_entity" ALTER COLUMN "updatedAt" SET DEFAULT '"2022-12-05T11:41:01.522Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments" ALTER COLUMN "createdAt" SET DEFAULT '"2022-12-05T11:41:01.523Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments" ALTER COLUMN "updatedAt" SET DEFAULT '"2022-12-05T11:41:01.523Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments_likes_entity" ALTER COLUMN "createdAt" SET DEFAULT '"2022-12-05T11:41:01.523Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments_likes_entity" ALTER COLUMN "updatedAt" SET DEFAULT '"2022-12-05T11:41:01.523Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "video_comments_likes_entity" ALTER COLUMN "updatedAt" SET DEFAULT '2022-12-05 11:23:01.57'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments_likes_entity" ALTER COLUMN "createdAt" SET DEFAULT '2022-12-05 11:23:01.57'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments" ALTER COLUMN "updatedAt" SET DEFAULT '2022-12-05 11:23:01.57'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_comments" ALTER COLUMN "createdAt" SET DEFAULT '2022-12-05 11:23:01.57'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_entity" ALTER COLUMN "updatedAt" SET DEFAULT '2022-12-05 11:23:01.586'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_entity" ALTER COLUMN "createdAt" SET DEFAULT '2022-12-05 11:23:01.586'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_report" ALTER COLUMN "updatedAt" SET DEFAULT '2022-12-05 11:23:01.586'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_report" ALTER COLUMN "createdAt" SET DEFAULT '2022-12-05 11:23:01.586'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_views" ALTER COLUMN "updatedAt" SET DEFAULT '2022-12-05 11:23:01.539'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_views" ALTER COLUMN "createdAt" SET DEFAULT '2022-12-05 11:23:01.539'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_reaction" ALTER COLUMN "updatedAt" SET DEFAULT '2022-12-05 11:23:01.526'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_reaction" ALTER COLUMN "createdAt" SET DEFAULT '2022-12-05 11:23:01.526'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_history" ALTER COLUMN "updatedAt" SET DEFAULT '2022-12-05 11:23:01.512'`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_history" ALTER COLUMN "createdAt" SET DEFAULT '2022-12-05 11:23:01.512'`,
    );
    await queryRunner.query(`ALTER TABLE "video_entity" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."video_entity_status_enum"`);
  }
}
