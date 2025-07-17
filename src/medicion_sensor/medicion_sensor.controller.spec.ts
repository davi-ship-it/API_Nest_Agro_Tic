import { Test, TestingModule } from '@nestjs/testing';
import { MedicionSensorController } from './medicion_sensor.controller';
import { MedicionSensorService } from './medicion_sensor.service';

describe('MedicionSensorController', () => {
  let controller: MedicionSensorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicionSensorController],
      providers: [MedicionSensorService],
    }).compile();

    controller = module.get<MedicionSensorController>(MedicionSensorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
