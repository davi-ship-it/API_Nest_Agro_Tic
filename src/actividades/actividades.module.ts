import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { Actividad } from './entities/actividades.entity';
import { CultivosVariedadXZona } from '../cultivos_variedad_x_zona/entities/cultivos_variedad_x_zona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad, CultivosVariedadXZona])],
  controllers: [ActividadesController],
  providers: [ActividadesService],
})
export class ActividadesModule {}
