import { Test, TestingModule } from '@nestjs/testing';
import { VariedadService } from './variedad.service';

describe('VariedadService', () => {
  let service: VariedadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariedadService],
    }).compile();

    service = module.get<VariedadService>(VariedadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
