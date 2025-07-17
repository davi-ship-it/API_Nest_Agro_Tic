import { Test, TestingModule } from '@nestjs/testing';
import { MedicionSensorService } from './medicion_sensor.service';

describe('MedicionSensorService', () => {
  let service: MedicionSensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicionSensorService],
    }).compile();

    service = module.get<MedicionSensorService>(MedicionSensorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
