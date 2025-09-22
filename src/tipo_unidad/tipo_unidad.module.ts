import { Module } from '@nestjs/common';
import { TipoUnidadService } from './tipo_unidad.service';
import { TipoUnidadController } from './tipo_unidad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUnidad } from './entities/tipo_unidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoUnidad])],
  controllers: [TipoUnidadController],
  providers: [TipoUnidadService],
  exports: [TipoUnidadService], // Exportamos el servicio para usarlo en el Seeder
})
export class TipoUnidadModule {}
