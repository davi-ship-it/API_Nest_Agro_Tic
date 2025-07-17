import { Test, TestingModule } from '@nestjs/testing';
import { CultivosXVariedadService } from './cultivos_x_variedad.service';

describe('CultivosXVariedadService', () => {
  let service: CultivosXVariedadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultivosXVariedadService],
    }).compile();

    service = module.get<CultivosXVariedadService>(CultivosXVariedadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
