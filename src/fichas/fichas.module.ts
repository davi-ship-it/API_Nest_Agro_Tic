import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ficha } from './entities/ficha.entity';
import { FichasService } from './fichas.service';
import { FichasController } from './fichas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ficha])],
  controllers: [FichasController],
  providers: [FichasService],
})
export class FichasModule {}
