import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1757102032363 implements MigrationInterface {
    name = 'InitialSchema1757102032363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recursos" ("pk_id_recurso" uuid NOT NULL DEFAULT uuid_generate_v4(), "recurso_nombre" character varying(100) NOT NULL, CONSTRAINT "UQ_b6b0becd16a7805a3abd2e8040f" UNIQUE ("recurso_nombre"), CONSTRAINT "PK_d7248e07fcefff849f1ed05b519" PRIMARY KEY ("pk_id_recurso"))`);
        await queryRunner.query(`CREATE TABLE "permisos" ("pk_id_permiso" uuid NOT NULL DEFAULT uuid_generate_v4(), "permiso_accion" character varying(50) NOT NULL, "fk_id_recurso" uuid NOT NULL, CONSTRAINT "UQ_94249bd4792ad592f51009b994f" UNIQUE ("permiso_accion", "fk_id_recurso"), CONSTRAINT "PK_cd8cb3a868a07cac7c78792b49a" PRIMARY KEY ("pk_id_permiso"))`);
        await queryRunner.query(`CREATE TABLE "roles_permisos" ("rol_id" uuid NOT NULL, "permiso_id" uuid NOT NULL, CONSTRAINT "PK_0e1dbe0449ae37ef1b31b0d9474" PRIMARY KEY ("rol_id", "permiso_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dc3cfbcce511233d4bef92d7e3" ON "roles_permisos" ("rol_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ef10d9983fcb45f0024cc7000d" ON "roles_permisos" ("permiso_id") `);
        await queryRunner.query(`ALTER TABLE "permisos" ADD CONSTRAINT "FK_1def2cd2fbc57f21d1547db508c" FOREIGN KEY ("fk_id_recurso") REFERENCES "recursos"("pk_id_recurso") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_permisos" ADD CONSTRAINT "FK_dc3cfbcce511233d4bef92d7e3b" FOREIGN KEY ("rol_id") REFERENCES "roles"("pk_id_rol") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permisos" ADD CONSTRAINT "FK_ef10d9983fcb45f0024cc7000d3" FOREIGN KEY ("permiso_id") REFERENCES "permisos"("pk_id_permiso") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permisos" DROP CONSTRAINT "FK_ef10d9983fcb45f0024cc7000d3"`);
        await queryRunner.query(`ALTER TABLE "roles_permisos" DROP CONSTRAINT "FK_dc3cfbcce511233d4bef92d7e3b"`);
        await queryRunner.query(`ALTER TABLE "permisos" DROP CONSTRAINT "FK_1def2cd2fbc57f21d1547db508c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef10d9983fcb45f0024cc7000d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc3cfbcce511233d4bef92d7e3"`);
        await queryRunner.query(`DROP TABLE "roles_permisos"`);
        await queryRunner.query(`DROP TABLE "permisos"`);
        await queryRunner.query(`DROP TABLE "recursos"`);
    }

}
