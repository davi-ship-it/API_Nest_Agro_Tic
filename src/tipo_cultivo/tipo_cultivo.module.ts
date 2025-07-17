import { Module } from '@nestjs/common';
import { TipoCultivoService } from './tipo_cultivo.service';
import { TipoCultivoController } from './tipo_cultivo.controller';

@Module({
  controllers: [TipoCultivoController],
  providers: [TipoCultivoService],
})
export class TipoCultivoModule {}
