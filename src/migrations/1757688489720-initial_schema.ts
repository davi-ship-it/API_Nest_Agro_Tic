import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1757688489720 implements MigrationInterface {
    name = 'InitialSchema1757688489720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rol_creacion_jerarquia" ("rol_creador_id" uuid NOT NULL, "rol_creable_id" uuid NOT NULL, CONSTRAINT "PK_9a6a7f47a3cf5c9bb058133556a" PRIMARY KEY ("rol_creador_id", "rol_creable_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1b25d18dffadb2e4dbbf66c901" ON "rol_creacion_jerarquia" ("rol_creador_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_06907d494f397996a2d85c0eb6" ON "rol_creacion_jerarquia" ("rol_creable_id") `);
        await queryRunner.query(`ALTER TABLE "rol_creacion_jerarquia" ADD CONSTRAINT "FK_1b25d18dffadb2e4dbbf66c901c" FOREIGN KEY ("rol_creador_id") REFERENCES "roles"("pk_id_rol") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rol_creacion_jerarquia" ADD CONSTRAINT "FK_06907d494f397996a2d85c0eb67" FOREIGN KEY ("rol_creable_id") REFERENCES "roles"("pk_id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rol_creacion_jerarquia" DROP CONSTRAINT "FK_06907d494f397996a2d85c0eb67"`);
        await queryRunner.query(`ALTER TABLE "rol_creacion_jerarquia" DROP CONSTRAINT "FK_1b25d18dffadb2e4dbbf66c901c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06907d494f397996a2d85c0eb6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b25d18dffadb2e4dbbf66c901"`);
        await queryRunner.query(`DROP TABLE "rol_creacion_jerarquia"`);
    }

}
