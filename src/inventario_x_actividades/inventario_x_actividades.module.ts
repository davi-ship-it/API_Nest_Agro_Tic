import { Module } from '@nestjs/common';
import { InventarioXActividadesService } from './inventario_x_actividades.service';
import { InventarioXActividadesController } from './inventario_x_actividades.controller';

@Module({
  controllers: [InventarioXActividadesController],
  providers: [InventarioXActividadesService],
})
export class InventarioXActividadesModule {}

