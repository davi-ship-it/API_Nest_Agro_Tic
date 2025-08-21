import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1755779826436 implements MigrationInterface {
    name = 'InitialSchema1755779826436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tipo_cultivo" RENAME COLUMN "nombre_tipo_cultivo" TO "nombre_tipo_cultivo_1"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tipo_cultivo" RENAME COLUMN "nombre_tipo_cultivo_1" TO "nombre_tipo_cultivo"`);
    }

}
