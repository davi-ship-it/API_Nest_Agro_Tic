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
import { ReservasXActividadService } from './reservas_x_actividad.service';
import { CreateReservasXActividadDto } from './dto/create-reservas_x_actividad.dto';
import { UpdateReservasXActividadDto } from './dto/update-reservas_x_actividad.dto';
import { FinalizeActivityDto } from './dto/finalize-activity.dto';

@ApiTags('reservas_x_actividad')
@Controller('reservas-x-actividad')
export class ReservasXActividadController {
  constructor(private readonly reservasXActividadService: ReservasXActividadService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reserva x actividad' })
  @ApiResponse({ status: 201, description: 'Reserva x actividad created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createReservasXActividadDto: CreateReservasXActividadDto) {
    return this.reservasXActividadService.create(createReservasXActividadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservas x actividad' })
  @ApiResponse({ status: 200, description: 'List of reservas x actividad' })
  findAll() {
    return this.reservasXActividadService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reserva x actividad by ID' })
  @ApiResponse({ status: 200, description: 'Reserva x actividad found' })
  @ApiResponse({ status: 404, description: 'Reserva x actividad not found' })
  findOne(@Param('id') id: string) {
    return this.reservasXActividadService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reserva x actividad by ID' })
  @ApiResponse({ status: 200, description: 'Reserva x actividad updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Reserva x actividad not found' })
  update(
    @Param('id') id: string,
    @Body() updateReservasXActividadDto: UpdateReservasXActividadDto,
  ) {
    return this.reservasXActividadService.update(id, updateReservasXActividadDto);
  }

  @Post('finalize')
  @ApiOperation({ summary: 'Finalize an activity' })
  @ApiResponse({ status: 200, description: 'Activity finalized successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  finalizeActivity(@Body() finalizeActivityDto: FinalizeActivityDto) {
    return this.reservasXActividadService.finalizeActivity(finalizeActivityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reserva x actividad by ID' })
  @ApiResponse({ status: 200, description: 'Reserva x actividad deleted' })
  @ApiResponse({ status: 404, description: 'Reserva x actividad not found' })
  remove(@Param('id') id: string) {
    return this.reservasXActividadService.remove(id);
  }
}