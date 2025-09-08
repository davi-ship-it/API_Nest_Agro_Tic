import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1757342912536 implements MigrationInterface {
    name = 'InitialSchema1757342912536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "usu_telefono" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "usu_telefono" DROP NOT NULL`);
    }

}
