import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUnidadService } from './tipo_unidad.service';
import { TipoUnidadController } from './tipo_unidad.controller';
import { TipoUnidad } from './entities/tipo_unidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoUnidad])],
  controllers: [TipoUnidadController],
  providers: [TipoUnidadService],
})
export class TipoUnidadModule {}
