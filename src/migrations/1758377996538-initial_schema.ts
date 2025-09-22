import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1758377996538 implements MigrationInterface {
    name = 'InitialSchema1758377996538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventario" RENAME COLUMN "inv_nombre" TO "inv_nombres"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventario" RENAME COLUMN "inv_nombres" TO "inv_nombre"`);
    }

}
