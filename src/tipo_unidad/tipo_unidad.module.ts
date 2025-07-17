import { Module } from '@nestjs/common';
import { TipoUnidadService } from './tipo_unidad.service';
import { TipoUnidadController } from './tipo_unidad.controller';

@Module({
  controllers: [TipoUnidadController],
  providers: [TipoUnidadService],
})
export class TipoUnidadModule {}
