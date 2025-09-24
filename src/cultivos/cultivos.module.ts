import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CultivosService } from './cultivos.service';
import { CultivosController } from './cultivos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo])],
  controllers: [CultivosController],
  providers: [CultivosService],
})
export class CultivosModule {}