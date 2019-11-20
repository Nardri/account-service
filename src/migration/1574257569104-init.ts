import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1574257569104 implements MigrationInterface {
  name = 'init1574257569104';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying(20) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "email" character varying(100) NOT NULL, "password" character varying(100), "isActive" boolean NOT NULL DEFAULT true, "verified" boolean NOT NULL DEFAULT false, "profileId" character varying(20), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" character varying(20) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "username" character varying(50), "firstName" character varying(100), "lastName" character varying(100), "photoUrl" character varying(225), "phone" character varying(100), "gender" "profile_gender_enum" NOT NULL DEFAULT '0', CONSTRAINT "UQ_d80b94dc62f7467403009d88062" UNIQUE ("username"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "profile"`, undefined);
    await queryRunner.query(`DROP TABLE "user"`, undefined);
  }
}
