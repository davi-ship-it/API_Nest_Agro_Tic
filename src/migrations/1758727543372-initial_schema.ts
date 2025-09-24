import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1758727543372 implements MigrationInterface {
    name = 'InitialSchema1758727543372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fichas" ("pk_id_ficha" uuid NOT NULL DEFAULT uuid_generate_v4(), "ficha_numero" integer NOT NULL, CONSTRAINT "UQ_d4cf2c92f89757be2ba36a82edc" UNIQUE ("ficha_numero"), CONSTRAINT "PK_ffb584f563667ba25e5d371bced" PRIMARY KEY ("pk_id_ficha"))`);
        await queryRunner.query(`CREATE TABLE "usuarios_fichas" ("usuario_id" uuid NOT NULL, "ficha_id" uuid NOT NULL, CONSTRAINT "PK_072d86c8fd5efbbb54dc65d4581" PRIMARY KEY ("usuario_id", "ficha_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3b2a0fbe0382b4a48ededa1c6" ON "usuarios_fichas" ("usuario_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8634dc7d36ded4b13ae469e54" ON "usuarios_fichas" ("ficha_id") `);
        await queryRunner.query(`ALTER TABLE "usuarios_fichas" ADD CONSTRAINT "FK_a3b2a0fbe0382b4a48ededa1c63" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("pk_id_usuario") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuarios_fichas" ADD CONSTRAINT "FK_a8634dc7d36ded4b13ae469e545" FOREIGN KEY ("ficha_id") REFERENCES "fichas"("pk_id_ficha") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios_fichas" DROP CONSTRAINT "FK_a8634dc7d36ded4b13ae469e545"`);
        await queryRunner.query(`ALTER TABLE "usuarios_fichas" DROP CONSTRAINT "FK_a3b2a0fbe0382b4a48ededa1c63"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a8634dc7d36ded4b13ae469e54"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3b2a0fbe0382b4a48ededa1c6"`);
        await queryRunner.query(`DROP TABLE "usuarios_fichas"`);
        await queryRunner.query(`DROP TABLE "fichas"`);
    }

}
