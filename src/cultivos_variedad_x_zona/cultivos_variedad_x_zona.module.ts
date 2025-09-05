import { Module } from '@nestjs/common';
import { CultivosVariedadXZonaService } from './cultivos_variedad_x_zona.service';
import { CultivosVariedadXZonaController } from './cultivos_variedad_x_zona.controller';

@Module({
  controllers: [CultivosVariedadXZonaController],
  providers: [CultivosVariedadXZonaService],
})
export class CultivosVariedadXZonaModule {}

