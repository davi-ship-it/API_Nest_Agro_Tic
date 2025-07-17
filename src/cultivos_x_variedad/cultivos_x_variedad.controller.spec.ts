import { Test, TestingModule } from '@nestjs/testing';
import { CultivosXVariedadController } from './cultivos_x_variedad.controller';
import { CultivosXVariedadService } from './cultivos_x_variedad.service';

describe('CultivosXVariedadController', () => {
  let controller: CultivosXVariedadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultivosXVariedadController],
      providers: [CultivosXVariedadService],
    }).compile();

    controller = module.get<CultivosXVariedadController>(CultivosXVariedadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
