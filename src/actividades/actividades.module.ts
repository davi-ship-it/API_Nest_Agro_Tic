import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { Actividad } from './entities/actividades.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad])],
  providers: [ActividadesService],
  controllers: [ActividadesController],
  exports: [TypeOrmModule], // opcional, si otros módulos también usan Actividad
})
export class ActividadesModule {}