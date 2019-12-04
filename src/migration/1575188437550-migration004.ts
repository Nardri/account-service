import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration0041575188437550 implements MigrationInterface {
  name = 'migration0041575188437550';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_2be576d0e6ed6df24d170e71eb7"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_2be576d0e6ed6df24d170e71eb7" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_2be576d0e6ed6df24d170e71eb7"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_2be576d0e6ed6df24d170e71eb7" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }
}
