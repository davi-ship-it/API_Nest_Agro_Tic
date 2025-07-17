import { Test, TestingModule } from '@nestjs/testing';
import { CultivosXEpaService } from './cultivos_x_epa.service';

describe('CultivosXEpaService', () => {
  let service: CultivosXEpaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultivosXEpaService],
    }).compile();

    service = module.get<CultivosXEpaService>(CultivosXEpaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
