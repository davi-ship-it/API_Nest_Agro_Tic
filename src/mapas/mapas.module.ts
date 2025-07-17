import { Module } from '@nestjs/common';
import { MapasService } from './mapas.service';
import { MapasController } from './mapas.controller';

@Module({
  controllers: [MapasController],
  providers: [MapasService],
})
export class MapasModule {}
