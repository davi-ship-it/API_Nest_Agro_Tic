import { Test, TestingModule } from '@nestjs/testing';
import { CultivosVariedadXZonaService } from './cultivos_variedad_x_zona.service';

describe('CultivosVariedadXZonaService', () => {
  let service: CultivosVariedadXZonaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultivosVariedadXZonaService],
    }).compile();

    service = module.get<CultivosVariedadXZonaService>(CultivosVariedadXZonaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
