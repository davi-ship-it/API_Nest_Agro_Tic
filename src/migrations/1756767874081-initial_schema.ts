import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1756767874081 implements MigrationInterface {
    name = 'InitialSchema1756767874081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "zonas" DROP CONSTRAINT "FK_c068ac2c1f04a99a59d1aaf74ed"`);
        await queryRunner.query(`ALTER TABLE "mapas" DROP CONSTRAINT "PK_e0ecbeeebab5aff6c227dee4ec0"`);
        await queryRunner.query(`ALTER TABLE "mapas" DROP COLUMN "pk_id_mapa"`);
        await queryRunner.query(`ALTER TABLE "mapas" ADD "pk_id_mapa" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "mapas" ADD CONSTRAINT "PK_e0ecbeeebab5aff6c227dee4ec0" PRIMARY KEY ("pk_id_mapa")`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" DROP CONSTRAINT "FK_f625a8d56b4c1e1f18fa2ad8bc7"`);
        await queryRunner.query(`ALTER TABLE "variedad" DROP CONSTRAINT "PK_969ecd3cd1b6413cddb77780f29"`);
        await queryRunner.query(`ALTER TABLE "variedad" DROP COLUMN "pk_id_variedad"`);
        await queryRunner.query(`ALTER TABLE "variedad" ADD "pk_id_variedad" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "variedad" ADD CONSTRAINT "PK_969ecd3cd1b6413cddb77780f29" PRIMARY KEY ("pk_id_variedad")`);
        await queryRunner.query(`ALTER TABLE "venta" DROP CONSTRAINT "PK_9e09d8f553efa44c3a81f51db78"`);
        await queryRunner.query(`ALTER TABLE "venta" DROP COLUMN "pk_id_venta"`);
        await queryRunner.query(`ALTER TABLE "venta" ADD "pk_id_venta" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "venta" ADD CONSTRAINT "PK_9e09d8f553efa44c3a81f51db78" PRIMARY KEY ("pk_id_venta")`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" DROP COLUMN "fk_id_variedad"`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" ADD "fk_id_variedad" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" DROP CONSTRAINT "PK_27916d7e87d22241cc58c494ed1"`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" DROP COLUMN "pk_id_usuarios_x_actividades"`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" ADD "pk_id_usuarios_x_actividades" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" ADD CONSTRAINT "PK_27916d7e87d22241cc58c494ed1" PRIMARY KEY ("pk_id_usuarios_x_actividades")`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" DROP CONSTRAINT "FK_959fe9d6787940b232ff5442540"`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" DROP COLUMN "fk_id_zona"`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" ADD "fk_id_zona" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_317e3ed127d5183a466383d910b"`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP COLUMN "fk_id_zona"`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD "fk_id_zona" uuid`);
        await queryRunner.query(`ALTER TABLE "zonas" DROP CONSTRAINT "PK_ed479402d4f4ca15c7d322f09a9"`);
        await queryRunner.query(`ALTER TABLE "zonas" DROP COLUMN "pk_id_zona"`);
        await queryRunner.query(`ALTER TABLE "zonas" ADD "pk_id_zona" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "zonas" ADD CONSTRAINT "PK_ed479402d4f4ca15c7d322f09a9" PRIMARY KEY ("pk_id_zona")`);
        await queryRunner.query(`ALTER TABLE "zonas" DROP COLUMN "fk_id_mapa"`);
        await queryRunner.query(`ALTER TABLE "zonas" ADD "fk_id_mapa" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" ADD CONSTRAINT "FK_f625a8d56b4c1e1f18fa2ad8bc7" FOREIGN KEY ("fk_id_variedad") REFERENCES "variedad"("pk_id_variedad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" ADD CONSTRAINT "FK_959fe9d6787940b232ff5442540" FOREIGN KEY ("fk_id_zona") REFERENCES "zonas"("pk_id_zona") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_317e3ed127d5183a466383d910b" FOREIGN KEY ("fk_id_zona") REFERENCES "zonas"("pk_id_zona") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "zonas" ADD CONSTRAINT "FK_c068ac2c1f04a99a59d1aaf74ed" FOREIGN KEY ("fk_id_mapa") REFERENCES "mapas"("pk_id_mapa") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "zonas" DROP CONSTRAINT "FK_c068ac2c1f04a99a59d1aaf74ed"`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_317e3ed127d5183a466383d910b"`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" DROP CONSTRAINT "FK_959fe9d6787940b232ff5442540"`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" DROP CONSTRAINT "FK_f625a8d56b4c1e1f18fa2ad8bc7"`);
        await queryRunner.query(`ALTER TABLE "zonas" DROP COLUMN "fk_id_mapa"`);
        await queryRunner.query(`ALTER TABLE "zonas" ADD "fk_id_mapa" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "zonas" DROP CONSTRAINT "PK_ed479402d4f4ca15c7d322f09a9"`);
        await queryRunner.query(`ALTER TABLE "zonas" DROP COLUMN "pk_id_zona"`);
        await queryRunner.query(`ALTER TABLE "zonas" ADD "pk_id_zona" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "zonas" ADD CONSTRAINT "PK_ed479402d4f4ca15c7d322f09a9" PRIMARY KEY ("pk_id_zona")`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP COLUMN "fk_id_zona"`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD "fk_id_zona" character varying`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_317e3ed127d5183a466383d910b" FOREIGN KEY ("fk_id_zona") REFERENCES "zonas"("pk_id_zona") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" DROP COLUMN "fk_id_zona"`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" ADD "fk_id_zona" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" ADD CONSTRAINT "FK_959fe9d6787940b232ff5442540" FOREIGN KEY ("fk_id_zona") REFERENCES "zonas"("pk_id_zona") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" DROP CONSTRAINT "PK_27916d7e87d22241cc58c494ed1"`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" DROP COLUMN "pk_id_usuarios_x_actividades"`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" ADD "pk_id_usuarios_x_actividades" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" ADD CONSTRAINT "PK_27916d7e87d22241cc58c494ed1" PRIMARY KEY ("pk_id_usuarios_x_actividades")`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" DROP COLUMN "fk_id_variedad"`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" ADD "fk_id_variedad" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venta" DROP CONSTRAINT "PK_9e09d8f553efa44c3a81f51db78"`);
        await queryRunner.query(`ALTER TABLE "venta" DROP COLUMN "pk_id_venta"`);
        await queryRunner.query(`ALTER TABLE "venta" ADD "pk_id_venta" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venta" ADD CONSTRAINT "PK_9e09d8f553efa44c3a81f51db78" PRIMARY KEY ("pk_id_venta")`);
        await queryRunner.query(`ALTER TABLE "variedad" DROP CONSTRAINT "PK_969ecd3cd1b6413cddb77780f29"`);
        await queryRunner.query(`ALTER TABLE "variedad" DROP COLUMN "pk_id_variedad"`);
        await queryRunner.query(`ALTER TABLE "variedad" ADD "pk_id_variedad" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "variedad" ADD CONSTRAINT "PK_969ecd3cd1b6413cddb77780f29" PRIMARY KEY ("pk_id_variedad")`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" ADD CONSTRAINT "FK_f625a8d56b4c1e1f18fa2ad8bc7" FOREIGN KEY ("fk_id_variedad") REFERENCES "variedad"("pk_id_variedad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mapas" DROP CONSTRAINT "PK_e0ecbeeebab5aff6c227dee4ec0"`);
        await queryRunner.query(`ALTER TABLE "mapas" DROP COLUMN "pk_id_mapa"`);
        await queryRunner.query(`ALTER TABLE "mapas" ADD "pk_id_mapa" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mapas" ADD CONSTRAINT "PK_e0ecbeeebab5aff6c227dee4ec0" PRIMARY KEY ("pk_id_mapa")`);
        await queryRunner.query(`ALTER TABLE "zonas" ADD CONSTRAINT "FK_c068ac2c1f04a99a59d1aaf74ed" FOREIGN KEY ("fk_id_mapa") REFERENCES "mapas"("pk_id_mapa") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
