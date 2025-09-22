import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1758295477803 implements MigrationInterface {
    name = 'InitialSchema1758295477803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tipo_unidad" ADD "tip_simbolo" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tipo_unidad" ADD CONSTRAINT "UQ_16771ce140b79d3834feb6db3fc" UNIQUE ("tip_simbolo")`);
        await queryRunner.query(`ALTER TABLE "tipo_unidad" DROP COLUMN "tip_nombre"`);
        await queryRunner.query(`ALTER TABLE "tipo_unidad" ADD "tip_nombre" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tipo_unidad" ADD CONSTRAINT "UQ_ce29936cd6da2573a84822b75fb" UNIQUE ("tip_nombre")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tipo_unidad" DROP CONSTRAINT "UQ_ce29936cd6da2573a84822b75fb"`);
        await queryRunner.query(`ALTER TABLE "tipo_unidad" DROP COLUMN "tip_nombre"`);
        await queryRunner.query(`ALTER TABLE "tipo_unidad" ADD "tip_nombre" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tipo_unidad" DROP CONSTRAINT "UQ_16771ce140b79d3834feb6db3fc"`);
        await queryRunner.query(`ALTER TABLE "tipo_unidad" DROP COLUMN "tip_simbolo"`);
    }

}
