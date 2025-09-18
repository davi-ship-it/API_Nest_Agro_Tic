import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCultivoService } from './tipo_cultivo.service';
import { TipoCultivoController } from './tipo_cultivo.controller';
import { TipoCultivo } from './entities/tipo_cultivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCultivo])],
  controllers: [TipoCultivoController],
  providers: [TipoCultivoService],
})
export class TipoCultivoModule {}
