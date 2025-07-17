import { Test, TestingModule } from '@nestjs/testing';
import { CultivosVariedadXZonaController } from './cultivos_variedad_x_zona.controller';
import { CultivosVariedadXZonaService } from './cultivos_variedad_x_zona.service';

describe('CultivosVariedadXZonaController', () => {
  let controller: CultivosVariedadXZonaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultivosVariedadXZonaController],
      providers: [CultivosVariedadXZonaService],
    }).compile();

    controller = module.get<CultivosVariedadXZonaController>(CultivosVariedadXZonaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
