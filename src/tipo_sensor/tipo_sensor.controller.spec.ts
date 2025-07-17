import { Test, TestingModule } from '@nestjs/testing';
import { TipoSensorController } from './tipo_sensor.controller';
import { TipoSensorService } from './tipo_sensor.service';

describe('TipoSensorController', () => {
  let controller: TipoSensorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoSensorController],
      providers: [TipoSensorService],
    }).compile();

    controller = module.get<TipoSensorController>(TipoSensorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
