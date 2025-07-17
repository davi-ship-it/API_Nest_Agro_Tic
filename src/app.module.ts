import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  imports: [MapasModule, MedicionSensorModule, SensorModule, TipoCultivoModule, TipoSensorModule, TipoUnidadModule, UsuariosModule, UsuariosXActividadesModule, VariedadModule, VentaModule, ZonasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
