import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration0031574625314553 implements MigrationInterface {
  name = 'migration0031574625314553';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "services" ADD CONSTRAINT "UQ_019d74f7abcdcb5a0113010cb03" UNIQUE ("name")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_2be576d0e6ed6df24d170e71eb7"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_36d7b8e1a331102ec9161e879ce"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ALTER COLUMN "serviceId" SET NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ALTER COLUMN "roleId" SET NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_2be576d0e6ed6df24d170e71eb7" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_36d7b8e1a331102ec9161e879ce" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_36d7b8e1a331102ec9161e879ce"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_2be576d0e6ed6df24d170e71eb7"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ALTER COLUMN "roleId" DROP NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ALTER COLUMN "serviceId" DROP NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_36d7b8e1a331102ec9161e879ce" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_2be576d0e6ed6df24d170e71eb7" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "services" DROP CONSTRAINT "UQ_019d74f7abcdcb5a0113010cb03"`,
      undefined,
    );
  }
}
