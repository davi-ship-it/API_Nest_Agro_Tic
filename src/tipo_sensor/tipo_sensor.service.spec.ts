import { Test, TestingModule } from '@nestjs/testing';
import { TipoSensorService } from './tipo_sensor.service';

describe('TipoSensorService', () => {
  let service: TipoSensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoSensorService],
    }).compile();

    service = module.get<TipoSensorService>(TipoSensorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
