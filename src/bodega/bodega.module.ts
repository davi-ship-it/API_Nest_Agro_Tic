import { Module } from '@nestjs/common';
import { BodegaService } from './bodega.service';
import { BodegaController } from './bodega.controller';

@Module({
  controllers: [BodegaController],
  providers: [BodegaService],
})
export class BodegaModule {}
