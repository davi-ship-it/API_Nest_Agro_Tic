import { Module } from '@nestjs/common';
import { UsuariosXActividadesService } from './usuarios_x_actividades.service';
import { UsuariosXActividadesController } from './usuarios_x_actividades.controller';

@Module({
  controllers: [UsuariosXActividadesController],
  providers: [UsuariosXActividadesService],
})
export class UsuariosXActividadesModule {}
