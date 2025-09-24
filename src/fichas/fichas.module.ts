import { Module } from '@nestjs/common';
import { FichasService } from './fichas.service';
import { FichasController } from './fichas.controller';

@Module({
  controllers: [FichasController],
  providers: [FichasService],
})
export class FichasModule {}
