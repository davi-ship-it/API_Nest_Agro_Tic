import { Module } from '@nestjs/common';
import { CategoriaActividadService } from './categoria_actividad.service';
import { CategoriaActividadController } from './categoria_actividad.controller';

@Module({
  controllers: [CategoriaActividadController],
  providers: [CategoriaActividadService],
})
export class CategoriaActividadModule {}
