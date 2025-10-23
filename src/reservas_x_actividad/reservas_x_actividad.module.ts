import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasXActividadService } from './reservas_x_actividad.service';
import { ReservasXActividadController } from './reservas_x_actividad.controller';
import { ReservasXActividad } from './entities/reservas_x_actividad.entity';
import { Actividad } from '../actividades/entities/actividades.entity';
import { EstadoReserva } from '../estados_reserva/entities/estados_reserva.entity';
import { LotesInventario } from '../lotes_inventario/entities/lotes_inventario.entity';
import { MovimientosInventario } from '../movimientos_inventario/entities/movimientos_inventario.entity';
import { TipoMovimiento } from '../tipos_movimiento/entities/tipos_movimiento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservasXActividad, Actividad, EstadoReserva, LotesInventario, MovimientosInventario, TipoMovimiento]),
  ],
  controllers: [ReservasXActividadController],
  providers: [ReservasXActividadService],
  exports: [ReservasXActividadService],
})
export class ReservasXActividadModule {}
