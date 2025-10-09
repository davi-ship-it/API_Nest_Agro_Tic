import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasXActividadService } from './reservas_x_actividad.service';
import { ReservasXActividadController } from './reservas_x_actividad.controller';
import { ReservasXActividad } from './entities/reservas_x_actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservasXActividad])],
  controllers: [ReservasXActividadController],
  providers: [ReservasXActividadService],
  exports: [ReservasXActividadService],
})
export class ReservasXActividadModule {}