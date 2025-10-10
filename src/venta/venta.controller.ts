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
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@ApiTags('venta')
@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({ status: 201, description: 'Sale created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventaService.create(createVentaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all sales' })
  @ApiResponse({ status: 200, description: 'List of all sales' })
  findAll() {
    return this.ventaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale details' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  findOne(@Param('id') id: string) {
    return this.ventaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventaService.update(id, updateVentaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale deleted successfully' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  remove(@Param('id') id: string) {
    return this.ventaService.remove(id);
  }
}
