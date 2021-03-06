import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration0011577873832514 implements MigrationInterface {
  name = 'migration0011577873832514';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying(20) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "email" character varying(100) NOT NULL, "password" character varying(100), "isActive" boolean NOT NULL DEFAULT true, "verified" boolean NOT NULL DEFAULT false, "roleId" character varying(20), "profileId" character varying(20), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_b1bda35cdb9a2c1b777f5541d8" UNIQUE ("profileId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TYPE "profiles_gender_enum" AS ENUM('0', '1', '2')`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" character varying(20) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "username" character varying(50), "firstName" character varying(100), "lastName" character varying(100), "photoUrl" character varying(225), "phone" character varying(100), "gender" "profiles_gender_enum" NOT NULL DEFAULT '0', CONSTRAINT "UQ_d1ea35db5be7c08520d70dc03f8" UNIQUE ("username"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "profiles"`, undefined);
    await queryRunner.query(`DROP TYPE "profiles_gender_enum"`, undefined);
    await queryRunner.query(`DROP TABLE "users"`, undefined);
  }
}
