import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1757104934231 implements MigrationInterface {
    name = 'InitialSchema1757104934231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "modulos" ("pk_id_modulo" uuid NOT NULL DEFAULT uuid_generate_v4(), "modulo_nombre" character varying(100) NOT NULL, CONSTRAINT "UQ_923a92db6231b5b2f2f7e9e5da2" UNIQUE ("modulo_nombre"), CONSTRAINT "PK_8a063140bc741bfecd07b24ff37" PRIMARY KEY ("pk_id_modulo"))`);
        await queryRunner.query(`ALTER TABLE "recursos" ADD "fk_id_modulo" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recursos" ADD CONSTRAINT "FK_f24d13798abb62d00be138dfc83" FOREIGN KEY ("fk_id_modulo") REFERENCES "modulos"("pk_id_modulo") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recursos" DROP CONSTRAINT "FK_f24d13798abb62d00be138dfc83"`);
        await queryRunner.query(`ALTER TABLE "recursos" DROP COLUMN "fk_id_modulo"`);
        await queryRunner.query(`DROP TABLE "modulos"`);
    }

}
