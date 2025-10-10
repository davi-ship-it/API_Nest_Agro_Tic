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
import { MovimientosInventarioService } from './movimientos_inventario.service';
import { CreateMovimientosInventarioDto } from './dto/create-movimientos_inventario.dto';
import { UpdateMovimientosInventarioDto } from './dto/update-movimientos_inventario.dto';

@ApiTags('movimientos_inventario')
@Controller('movimientos-inventario')
export class MovimientosInventarioController {
  constructor(private readonly movimientosInventarioService: MovimientosInventarioService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory movement' })
  @ApiResponse({ status: 201, description: 'Inventory movement created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createMovimientosInventarioDto: CreateMovimientosInventarioDto) {
    return this.movimientosInventarioService.create(createMovimientosInventarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all inventory movements' })
  @ApiResponse({ status: 200, description: 'List of all inventory movements' })
  findAll() {
    return this.movimientosInventarioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific inventory movement by ID' })
  @ApiResponse({ status: 200, description: 'Inventory movement details' })
  @ApiResponse({ status: 404, description: 'Inventory movement not found' })
  findOne(@Param('id') id: string) {
    return this.movimientosInventarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inventory movement by ID' })
  @ApiResponse({ status: 200, description: 'Inventory movement updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Inventory movement not found' })
  update(
    @Param('id') id: string,
    @Body() updateMovimientosInventarioDto: UpdateMovimientosInventarioDto,
  ) {
    return this.movimientosInventarioService.update(id, updateMovimientosInventarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an inventory movement by ID' })
  @ApiResponse({ status: 200, description: 'Inventory movement deleted successfully' })
  @ApiResponse({ status: 404, description: 'Inventory movement not found' })
  remove(@Param('id') id: string) {
    return this.movimientosInventarioService.remove(id);
  }
}