import { Test, TestingModule } from '@nestjs/testing';
import { CultivosXEpaController } from './cultivos_x_epa.controller';
import { CultivosXEpaService } from './cultivos_x_epa.service';

describe('CultivosXEpaController', () => {
  let controller: CultivosXEpaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultivosXEpaController],
      providers: [CultivosXEpaService],
    }).compile();

    controller = module.get<CultivosXEpaController>(CultivosXEpaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
