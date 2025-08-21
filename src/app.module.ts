import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ActividadesModule } from './actividades/actividades.module';
import { BodegaModule } from './bodega/bodega.module';
import { CosechasModule } from './cosechas/cosechas.module';
import { CultivosModule } from './cultivos/cultivos.module';
import { CultivosVariedadXZonaModule } from './cultivos_variedad_x_zona/cultivos_variedad_x_zona.module';
import { CultivosXEpaModule } from './cultivos_x_epa/cultivos_x_epa.module';
import { CultivosXVariedadModule } from './cultivos_x_variedad/cultivos_x_variedad.module';
import { EpaModule } from './epa/epa.module';
import { InventarioModule } from './inventario/inventario.module';
import { InventarioXActividadesModule } from './inventario_x_actividades/inventario_x_actividades.module';
import { CategoriaModule } from './categoria/categoria.module';
import { MapasModule } from './mapas/mapas.module';
import { MedicionSensorModule } from './medicion_sensor/medicion_sensor.module';
import { SensorModule } from './sensor/sensor.module';
import { TipoCultivoModule } from './tipo_cultivo/tipo_cultivo.module';
import { TipoSensorModule } from './tipo_sensor/tipo_sensor.module';
import { TipoUnidadModule } from './tipo_unidad/tipo_unidad.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UsuariosXActividadesModule } from './usuarios_x_actividades/usuarios_x_actividades.module';
import { VariedadModule } from './variedad/variedad.module';
import { VentaModule } from './venta/venta.module';
import { ZonasModule } from './zonas/zonas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5433,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Esto cargará todas las entidades automáticamente
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: false,
      logging: ['query', 'error'],
    }),

    ActividadesModule,
    BodegaModule,
    CosechasModule,
    CultivosModule,
    CultivosVariedadXZonaModule,
    CultivosXEpaModule,
    CultivosXVariedadModule,
    EpaModule,
    InventarioModule,
    InventarioXActividadesModule,
    CategoriaModule,
    MapasModule,
    MedicionSensorModule,
    SensorModule,
    TipoCultivoModule,
    TipoSensorModule,
    TipoUnidadModule,
    UsuariosModule, // Solo una vez
    UsuariosXActividadesModule,
    VariedadModule,
    VentaModule,
    ZonasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
