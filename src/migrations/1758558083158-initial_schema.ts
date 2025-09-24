import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1758558083158 implements MigrationInterface {
    name = 'InitialSchema1758558083158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cultivos" DROP COLUMN "cul_descripcion"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cultivos" ADD "cul_descripcion" text`);
    }

}
