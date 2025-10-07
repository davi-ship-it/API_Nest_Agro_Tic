import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1759254503742 implements MigrationInterface {
    name = 'InitialSchema1759254503742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cultivos" DROP COLUMN "cul_cosecha"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cultivos" ADD "cul_cosecha" date`);
    }

}
