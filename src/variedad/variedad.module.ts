import { Module } from '@nestjs/common';
import { VariedadService } from './variedad.service';
import { VariedadController } from './variedad.controller';

@Module({
  controllers: [VariedadController],
  providers: [VariedadService],
})
export class VariedadModule {}

