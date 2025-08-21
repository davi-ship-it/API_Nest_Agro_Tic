import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1755702737168 implements MigrationInterface {
    name = 'InitialSchema1755702737168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tipo_cultivo" ("pk_id_tipo_cultivo" SERIAL NOT NULL, "nombre_tipo_cultivo" character varying(50) NOT NULL, CONSTRAINT "PK_587358c5f6b5c8b443435ab7e7a" PRIMARY KEY ("pk_id_tipo_cultivo"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tipo_cultivo"`);
    }

}
