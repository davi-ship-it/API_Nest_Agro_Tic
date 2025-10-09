import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { Actividad } from './entities/actividades.entity';
import { ReservasXActividadModule } from '../reservas_x_actividad/reservas_x_actividad.module';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad]), ReservasXActividadModule],
  providers: [ActividadesService],
  controllers: [ActividadesController],
  exports: [TypeOrmModule], // opcional, si otros módulos también usan Actividad
})
export class ActividadesModule {}
