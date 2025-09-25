import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodegaService } from './bodega.service';
import { BodegaController } from './bodega.controller';
import { Bodega } from '../../src/bodega/entities/bodega.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bodega])], // 👈 importante
  controllers: [BodegaController],
  providers: [BodegaService],
})
export class BodegaModule {}
