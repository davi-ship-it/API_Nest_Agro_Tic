import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1755784005014 implements MigrationInterface {
    name = 'InitialSchema1755784005014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tipo_cultivo" RENAME COLUMN "nombre_tipo_cultivo_1" TO "tpc_nombre"`);
        await queryRunner.query(`CREATE TABLE "mapas" ("pk_id_mapa" SERIAL NOT NULL, "map_url_img" character varying(255) NOT NULL, CONSTRAINT "PK_e0ecbeeebab5aff6c227dee4ec0" PRIMARY KEY ("pk_id_mapa"))`);
        await queryRunner.query(`CREATE TABLE "cultivos" ("pk_id_cultivo" SERIAL NOT NULL, "cul_descripcion" text, "cul_estado" smallint NOT NULL DEFAULT '1', "cul_siembra" date, CONSTRAINT "PK_bca07ab50918efd3cbfa5d751f9" PRIMARY KEY ("pk_id_cultivo"))`);
        await queryRunner.query(`CREATE TABLE "variedad" ("pk_id_variedad" SERIAL NOT NULL, "var_nombre" character varying(50) NOT NULL, "fk_id_tipo_cultivo" integer, CONSTRAINT "PK_969ecd3cd1b6413cddb77780f29" PRIMARY KEY ("pk_id_variedad"))`);
        await queryRunner.query(`CREATE TABLE "venta" ("pk_id_venta" SERIAL NOT NULL, "ven_cantidad" numeric(10,2) NOT NULL, "ven_fecha" date NOT NULL, "fk_id_cosecha" integer NOT NULL, "ven_precio_kilo" numeric, "ven_venta_total" numeric, CONSTRAINT "PK_9e09d8f553efa44c3a81f51db78" PRIMARY KEY ("pk_id_venta"))`);
        await queryRunner.query(`CREATE TABLE "cosechas" ("pk_id_cosecha" SERIAL NOT NULL, "cos_unidad_medida" character varying(2) NOT NULL, "cos_cantidad" numeric(10,2) NOT NULL, "cos_fecha" date, "fk_id_cultivos_x_variedad" integer NOT NULL, CONSTRAINT "PK_bbbe964394805bbf4b0c03f620e" PRIMARY KEY ("pk_id_cosecha"))`);
        await queryRunner.query(`CREATE TABLE "cultivos_x_variedad" ("pk_id_cultivos_x_variedad" SERIAL NOT NULL, "fk_id_cultivo" integer NOT NULL, "fk_id_variedad" integer NOT NULL, CONSTRAINT "PK_08252ea88874d61f1b3e9061574" PRIMARY KEY ("pk_id_cultivos_x_variedad"))`);
        await queryRunner.query(`CREATE TABLE "tipo_unidad" ("pk_id_tipo_unidad" SERIAL NOT NULL, "tip_nombre" character varying(10) NOT NULL, CONSTRAINT "PK_b77280e50b68f8b4ffa9b7ed5a1" PRIMARY KEY ("pk_id_tipo_unidad"))`);
        await queryRunner.query(`CREATE TABLE "categoria" ("pk_id_categoria" SERIAL NOT NULL, "cat_nombre" character varying(100) NOT NULL, "fk_id_tipo_unidad" integer NOT NULL, CONSTRAINT "PK_95fc9372feb2e03fd9d0b78a19d" PRIMARY KEY ("pk_id_categoria"))`);
        await queryRunner.query(`CREATE TABLE "bodega" ("pk_id_bodega" SERIAL NOT NULL, "bod_numero" character varying(15) NOT NULL, "bod_nombre" character varying(100) NOT NULL, CONSTRAINT "PK_f1488a686bf47ab88f6e9b079a8" PRIMARY KEY ("pk_id_bodega"))`);
        await queryRunner.query(`CREATE TABLE "inventario" ("pk_id_inventario" SERIAL NOT NULL, "inv_nombre" character varying(100) NOT NULL, "inv_descripcion" text, "inv_stock" integer NOT NULL, "inv_precio" numeric NOT NULL, "inv_capacidad_unidad" numeric(10,2), "ivn_fecha_vencimiento" date, "inv_img_url" character varying(255) NOT NULL, "fk_id_categoria" integer, "fk_id_bodega" integer, CONSTRAINT "PK_236e234c49a4424418cb00e6a14" PRIMARY KEY ("pk_id_inventario"))`);
        await queryRunner.query(`CREATE TABLE "inventario_x_actividades" ("pk_id_inventario_x_actividad" SERIAL NOT NULL, "fk_id_inventario" integer, "fk_id_actividad" integer, "ixa_cantidad_usada" numeric, CONSTRAINT "PK_b5606ec356c22d5fac558d9b8c5" PRIMARY KEY ("pk_id_inventario_x_actividad"))`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("pk_id_usuario" SERIAL NOT NULL, "usu_nombres" character varying(50) NOT NULL, "usu_apellidos" character varying(50) NOT NULL, "usu_password_h" character varying(255) NOT NULL, "usu_telefono" bigint, "usu_correo" character varying(255) NOT NULL, "usu_rol" character varying(8) NOT NULL, "usu_dni" bigint NOT NULL, CONSTRAINT "PK_51cd6eda4d00711d8046b3371b5" PRIMARY KEY ("pk_id_usuario"))`);
        await queryRunner.query(`CREATE TABLE "usuarios_x_actividades" ("pk_id_usuarios_x_actividades" SERIAL NOT NULL, "fk_id_usuario" integer NOT NULL, "fk_id_actividad" integer NOT NULL, "uxa_fecha_asignacion" date NOT NULL, CONSTRAINT "PK_27916d7e87d22241cc58c494ed1" PRIMARY KEY ("pk_id_usuarios_x_actividades"))`);
        await queryRunner.query(`CREATE TABLE "actividades" ("pk_id_actividad" SERIAL NOT NULL, "act_nombre" character varying(255) NOT NULL, "act_descripcion" text NOT NULL, "act_fecha_inicio" date NOT NULL, "act_fecha_fin" date, "act_estado" character varying(10), "act_img_url" character varying(255) NOT NULL, "fk_id_cultivo_variedad_x_zona" integer NOT NULL, CONSTRAINT "PK_0da23a7b5690826fcc0853856ad" PRIMARY KEY ("pk_id_actividad"))`);
        await queryRunner.query(`CREATE TABLE "cultivos_variedad_x_zona" ("pk_id_cv_zona" SERIAL NOT NULL, "fk_id_cultivos_x_variedad" integer NOT NULL, "fk_id_zona" integer NOT NULL, CONSTRAINT "PK_26b6aa02204bf2010c4120ee902" PRIMARY KEY ("pk_id_cv_zona"))`);
        await queryRunner.query(`CREATE TABLE "zonas" ("pk_id_zona" SERIAL NOT NULL, "zon_nombre" character varying(50) NOT NULL, "zon_tipo_lote" character varying(8) NOT NULL, "zon_coor_x" numeric(10,2) NOT NULL, "zon_coor_y" numeric(10,2) NOT NULL, "fk_id_mapa" integer NOT NULL, CONSTRAINT "PK_ed479402d4f4ca15c7d322f09a9" PRIMARY KEY ("pk_id_zona"))`);
        await queryRunner.query(`CREATE TABLE "medicion_sensor" ("pk_id_medicion" SERIAL NOT NULL, "med_valor" numeric(10,2) NOT NULL, "med_fecha_medicion" TIMESTAMP NOT NULL, "fk_id_sensor" integer NOT NULL, CONSTRAINT "PK_93f31099faa603caa41f2311044" PRIMARY KEY ("pk_id_medicion"))`);
        await queryRunner.query(`CREATE TABLE "sensor" ("pk_id_sensor" SERIAL NOT NULL, "sen_nombre" character varying(50) NOT NULL, "sen_coor_x" integer NOT NULL, "sen_coor_y" integer NOT NULL, "sen_rango_minimo" numeric(10,2), "sen_rango_maximo" numeric(10,2), "sen_img" character varying(255) NOT NULL, "sen_estado" smallint NOT NULL, "sen_fecha_instalacion" TIMESTAMP NOT NULL, "sen_fecha_ultimo_mantenimiento" TIMESTAMP, "fk_id_tipo_sensor" integer NOT NULL, "fk_id_zona" integer, CONSTRAINT "PK_29eb369add2b5d73d5d64f1f140" PRIMARY KEY ("pk_id_sensor"))`);
        await queryRunner.query(`CREATE TABLE "tipo_sensor" ("pk_id_tipo_sensor" SERIAL NOT NULL, "tps_nombre" character varying(50) NOT NULL, "tps_descripcion" text, "tps_unidad_medida" character varying(20) NOT NULL, CONSTRAINT "PK_cd37a52a5c0b91ac14da63b4ce7" PRIMARY KEY ("pk_id_tipo_sensor"))`);
        await queryRunner.query(`CREATE TABLE "epa" ("pk_id_epa" SERIAL NOT NULL, "epa_nombre" character varying(100) NOT NULL, "epa_descripcion" text, "epa_img_url" character varying(255), "epa_tipo" character varying(10) NOT NULL, CONSTRAINT "PK_9a3b902c7db65928623ec6598a9" PRIMARY KEY ("pk_id_epa"))`);
        await queryRunner.query(`CREATE TABLE "cultivos_x_epa" ("pk_id_cultivos_x_epa" SERIAL NOT NULL, "cxp_fecha_deteccion" date NOT NULL, "cxp_estado" smallint NOT NULL, "fk_id_cultivos_x_variedad" integer NOT NULL, "fk_id_epa" integer NOT NULL, CONSTRAINT "PK_50265e93fa52fa016463f1c1d91" PRIMARY KEY ("pk_id_cultivos_x_epa"))`);
        await queryRunner.query(`ALTER TABLE "variedad" ADD CONSTRAINT "FK_32531335d0482591eae661efcbf" FOREIGN KEY ("fk_id_tipo_cultivo") REFERENCES "tipo_cultivo"("pk_id_tipo_cultivo") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venta" ADD CONSTRAINT "FK_1b5df15fa07acae8d18b095d5dc" FOREIGN KEY ("fk_id_cosecha") REFERENCES "cosechas"("pk_id_cosecha") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cosechas" ADD CONSTRAINT "FK_e1ef0bdffb6d77549cce9776704" FOREIGN KEY ("fk_id_cultivos_x_variedad") REFERENCES "cultivos_x_variedad"("pk_id_cultivos_x_variedad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" ADD CONSTRAINT "FK_3869d84e502689591c987724be9" FOREIGN KEY ("fk_id_cultivo") REFERENCES "cultivos"("pk_id_cultivo") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" ADD CONSTRAINT "FK_f625a8d56b4c1e1f18fa2ad8bc7" FOREIGN KEY ("fk_id_variedad") REFERENCES "variedad"("pk_id_variedad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categoria" ADD CONSTRAINT "FK_d1824a14f87851f91e40b12d04a" FOREIGN KEY ("fk_id_tipo_unidad") REFERENCES "tipo_unidad"("pk_id_tipo_unidad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventario" ADD CONSTRAINT "FK_637b0670660f1ada42c38711034" FOREIGN KEY ("fk_id_categoria") REFERENCES "categoria"("pk_id_categoria") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventario" ADD CONSTRAINT "FK_a167172066783acbed52234edcc" FOREIGN KEY ("fk_id_bodega") REFERENCES "bodega"("pk_id_bodega") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventario_x_actividades" ADD CONSTRAINT "FK_795ce09414b2c69cf63b42f11ac" FOREIGN KEY ("fk_id_inventario") REFERENCES "inventario"("pk_id_inventario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventario_x_actividades" ADD CONSTRAINT "FK_51f1359b32c9aa2022d3a7a78d5" FOREIGN KEY ("fk_id_actividad") REFERENCES "actividades"("pk_id_actividad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" ADD CONSTRAINT "FK_58a5178734438394ee03a24949a" FOREIGN KEY ("fk_id_usuario") REFERENCES "usuarios"("pk_id_usuario") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" ADD CONSTRAINT "FK_399398e334d7c22d172a9a4fb9b" FOREIGN KEY ("fk_id_actividad") REFERENCES "actividades"("pk_id_actividad") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "actividades" ADD CONSTRAINT "FK_4ff147ed17e8bdeb0a22232cf5b" FOREIGN KEY ("fk_id_cultivo_variedad_x_zona") REFERENCES "cultivos_variedad_x_zona"("pk_id_cv_zona") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" ADD CONSTRAINT "FK_bedc232cd8a0b1aba926d53af68" FOREIGN KEY ("fk_id_cultivos_x_variedad") REFERENCES "cultivos_x_variedad"("pk_id_cultivos_x_variedad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" ADD CONSTRAINT "FK_959fe9d6787940b232ff5442540" FOREIGN KEY ("fk_id_zona") REFERENCES "zonas"("pk_id_zona") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "zonas" ADD CONSTRAINT "FK_c068ac2c1f04a99a59d1aaf74ed" FOREIGN KEY ("fk_id_mapa") REFERENCES "mapas"("pk_id_mapa") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "medicion_sensor" ADD CONSTRAINT "FK_0f56b05d9849e391c50ef8c1491" FOREIGN KEY ("fk_id_sensor") REFERENCES "sensor"("pk_id_sensor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_48052e061c57447d62f9e64b3da" FOREIGN KEY ("fk_id_tipo_sensor") REFERENCES "tipo_sensor"("pk_id_tipo_sensor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_317e3ed127d5183a466383d910b" FOREIGN KEY ("fk_id_zona") REFERENCES "zonas"("pk_id_zona") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_epa" ADD CONSTRAINT "FK_62ec7f2dad568439e62f7896b73" FOREIGN KEY ("fk_id_cultivos_x_variedad") REFERENCES "cultivos_x_variedad"("pk_id_cultivos_x_variedad") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_epa" ADD CONSTRAINT "FK_e93725ad163564397db9100ca2d" FOREIGN KEY ("fk_id_epa") REFERENCES "epa"("pk_id_epa") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cultivos_x_epa" DROP CONSTRAINT "FK_e93725ad163564397db9100ca2d"`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_epa" DROP CONSTRAINT "FK_62ec7f2dad568439e62f7896b73"`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_317e3ed127d5183a466383d910b"`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_48052e061c57447d62f9e64b3da"`);
        await queryRunner.query(`ALTER TABLE "medicion_sensor" DROP CONSTRAINT "FK_0f56b05d9849e391c50ef8c1491"`);
        await queryRunner.query(`ALTER TABLE "zonas" DROP CONSTRAINT "FK_c068ac2c1f04a99a59d1aaf74ed"`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" DROP CONSTRAINT "FK_959fe9d6787940b232ff5442540"`);
        await queryRunner.query(`ALTER TABLE "cultivos_variedad_x_zona" DROP CONSTRAINT "FK_bedc232cd8a0b1aba926d53af68"`);
        await queryRunner.query(`ALTER TABLE "actividades" DROP CONSTRAINT "FK_4ff147ed17e8bdeb0a22232cf5b"`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" DROP CONSTRAINT "FK_399398e334d7c22d172a9a4fb9b"`);
        await queryRunner.query(`ALTER TABLE "usuarios_x_actividades" DROP CONSTRAINT "FK_58a5178734438394ee03a24949a"`);
        await queryRunner.query(`ALTER TABLE "inventario_x_actividades" DROP CONSTRAINT "FK_51f1359b32c9aa2022d3a7a78d5"`);
        await queryRunner.query(`ALTER TABLE "inventario_x_actividades" DROP CONSTRAINT "FK_795ce09414b2c69cf63b42f11ac"`);
        await queryRunner.query(`ALTER TABLE "inventario" DROP CONSTRAINT "FK_a167172066783acbed52234edcc"`);
        await queryRunner.query(`ALTER TABLE "inventario" DROP CONSTRAINT "FK_637b0670660f1ada42c38711034"`);
        await queryRunner.query(`ALTER TABLE "categoria" DROP CONSTRAINT "FK_d1824a14f87851f91e40b12d04a"`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" DROP CONSTRAINT "FK_f625a8d56b4c1e1f18fa2ad8bc7"`);
        await queryRunner.query(`ALTER TABLE "cultivos_x_variedad" DROP CONSTRAINT "FK_3869d84e502689591c987724be9"`);
        await queryRunner.query(`ALTER TABLE "cosechas" DROP CONSTRAINT "FK_e1ef0bdffb6d77549cce9776704"`);
        await queryRunner.query(`ALTER TABLE "venta" DROP CONSTRAINT "FK_1b5df15fa07acae8d18b095d5dc"`);
        await queryRunner.query(`ALTER TABLE "variedad" DROP CONSTRAINT "FK_32531335d0482591eae661efcbf"`);
        await queryRunner.query(`DROP TABLE "cultivos_x_epa"`);
        await queryRunner.query(`DROP TABLE "epa"`);
        await queryRunner.query(`DROP TABLE "tipo_sensor"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
        await queryRunner.query(`DROP TABLE "medicion_sensor"`);
        await queryRunner.query(`DROP TABLE "zonas"`);
        await queryRunner.query(`DROP TABLE "cultivos_variedad_x_zona"`);
        await queryRunner.query(`DROP TABLE "actividades"`);
        await queryRunner.query(`DROP TABLE "usuarios_x_actividades"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TABLE "inventario_x_actividades"`);
        await queryRunner.query(`DROP TABLE "inventario"`);
        await queryRunner.query(`DROP TABLE "bodega"`);
        await queryRunner.query(`DROP TABLE "categoria"`);
        await queryRunner.query(`DROP TABLE "tipo_unidad"`);
        await queryRunner.query(`DROP TABLE "cultivos_x_variedad"`);
        await queryRunner.query(`DROP TABLE "cosechas"`);
        await queryRunner.query(`DROP TABLE "venta"`);
        await queryRunner.query(`DROP TABLE "variedad"`);
        await queryRunner.query(`DROP TABLE "cultivos"`);
        await queryRunner.query(`DROP TABLE "mapas"`);
        await queryRunner.query(`ALTER TABLE "tipo_cultivo" RENAME COLUMN "tpc_nombre" TO "nombre_tipo_cultivo_1"`);
    }

}
