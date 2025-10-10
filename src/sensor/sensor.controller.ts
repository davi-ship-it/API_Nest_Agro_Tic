import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@ApiTags('sensor')
@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sensor' })
  @ApiResponse({ status: 201, description: 'Sensor created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createSensorDto: CreateSensorDto) {
    return this.sensorService.create(createSensorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sensors' })
  @ApiResponse({ status: 200, description: 'List of sensors' })
  findAll() {
    return this.sensorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sensor by ID' })
  @ApiResponse({ status: 200, description: 'Sensor found' })
  @ApiResponse({ status: 404, description: 'Sensor not found' })
  findOne(@Param('id') id: string) {
    return this.sensorService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sensor by ID' })
  @ApiResponse({ status: 200, description: 'Sensor updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Sensor not found' })
  update(@Param('id') id: string, @Body() updateSensorDto: UpdateSensorDto) {
    return this.sensorService.update(+id, updateSensorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sensor by ID' })
  @ApiResponse({ status: 200, description: 'Sensor deleted' })
  @ApiResponse({ status: 404, description: 'Sensor not found' })
  remove(@Param('id') id: string) {
    return this.sensorService.remove(+id);
  }
}
