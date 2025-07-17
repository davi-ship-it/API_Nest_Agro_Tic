import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
import { MapasController } from './mapas/mapas.controller';
import { MedicionSensorController } from './medicion_sensor/medicion_sensor.controller';
import { SensorController } from './sensor/sensor.controller';
import { TipoCultivoController } from './tipo_cultivo/tipo_cultivo.controller';
import { TipoSensorController } from './tipo_sensor/tipo_sensor.controller';
import { TipoUnidadController } from './tipo_unidad/tipo_unidad.controller';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosXActividadesController } from './usuarios_x_actividades/usuarios_x_actividades.controller';
import { VariedadController } from './variedad/variedad.controller';
import { Venta } from './venta/entities/venta.entity';
import { VentaController } from './venta/venta.controller';
import { ZonasController } from './zonas/zonas.controller';

@Module({
  imports: [ActividadesModule, BodegaModule, CosechasModule, CultivosModule, CultivosVariedadXZonaModule, CultivosXEpaModule, CultivosXVariedadModule, EpaModule, InventarioModule, InventarioXActividadesModule, CategoriaModule, MapasController, MedicionSensorController,SensorController, TipoCultivoController, TipoSensorController,TipoUnidadController, UsuariosController, UsuariosXActividadesController, VariedadController,VentaController, ZonasController],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
