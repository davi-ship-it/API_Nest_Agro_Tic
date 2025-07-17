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

@Module({
  imports: [ActividadesModule, BodegaModule, CosechasModule, CultivosModule, CultivosVariedadXZonaModule, CultivosXEpaModule, CultivosXVariedadModule, EpaModule, InventarioModule, InventarioXActividadesModule, CategoriaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
