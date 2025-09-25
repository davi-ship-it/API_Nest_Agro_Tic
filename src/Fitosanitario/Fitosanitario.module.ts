import { Module } from '@nestjs/common';
import { FitosanitarioController } from './Fitosanitario.controller';
import { FitosanitarioService } from './Fitosanitario.service';

@Module({
  controllers: [FitosanitarioController],
  providers: [FitosanitarioService],
})
export class FitosanitarioModule {}
