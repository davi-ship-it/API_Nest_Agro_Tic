import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioXActividadesService } from './inventario_x_actividades.service';
import { InventarioXActividadesController } from './inventario_x_actividades.controller';
import { InventarioXActividad } from './entities/inventario_x_actividades.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventarioXActividad])],
  controllers: [InventarioXActividadesController],
  providers: [InventarioXActividadesService],
})
export class InventarioXActividadesModule {}
