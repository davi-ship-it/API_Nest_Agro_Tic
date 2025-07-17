import { Module } from '@nestjs/common';
import { CosechasService } from './cosechas.service';
import { CosechasController } from './cosechas.controller';

@Module({
  controllers: [CosechasController],
  providers: [CosechasService],
})
export class CosechasModule {}
