import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LotesInventarioService } from './lotes_inventario.service';
import { CreateLotesInventarioDto } from './dto/create-lotes_inventario.dto';
import { UpdateLotesInventarioDto } from './dto/update-lotes_inventario.dto';

@ApiTags('inventario')
@Controller('inventario')
export class LotesInventarioController {
  constructor(private readonly lotesInventarioService: LotesInventarioService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory lot' })
  @ApiResponse({ status: 201, description: 'Inventory lot created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createLotesInventarioDto: CreateLotesInventarioDto) {
    return this.lotesInventarioService.create(createLotesInventarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all inventory lots with pagination' })
  @ApiResponse({ status: 200, description: 'List of inventory lots' })
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.lotesInventarioService.findAllPaginated(pageNum, limitNum);
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search inventory lots by query with pagination' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(
    @Param('query') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.lotesInventarioService.search(query, pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an inventory lot by ID' })
  @ApiResponse({ status: 200, description: 'Inventory lot details' })
  @ApiResponse({ status: 404, description: 'Inventory lot not found' })
  findOne(@Param('id') id: string) {
    return this.lotesInventarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inventory lot by ID' })
  @ApiResponse({ status: 200, description: 'Inventory lot updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Inventory lot not found' })
  update(
    @Param('id') id: string,
    @Body() updateLotesInventarioDto: UpdateLotesInventarioDto,
  ) {
    return this.lotesInventarioService.update(id, updateLotesInventarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an inventory lot by ID' })
  @ApiResponse({ status: 200, description: 'Inventory lot deleted successfully' })
  @ApiResponse({ status: 404, description: 'Inventory lot not found' })
  remove(@Param('id') id: string) {
    return this.lotesInventarioService.remove(id);
  }

  @Get('available-products')
  @ApiOperation({ summary: 'Get available products' })
  @ApiResponse({ status: 200, description: 'List of available products' })
  getAvailableProducts() {
    return this.lotesInventarioService.getAvailableProducts();
  }
}