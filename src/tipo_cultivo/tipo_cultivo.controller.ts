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
import { TipoCultivoService } from './tipo_cultivo.service';
import { CreateTipoCultivoDto } from './dto/create-tipo_cultivo.dto';
import { UpdateTipoCultivoDto } from './dto/update-tipo_cultivo.dto';

@ApiTags('tipo_cultivo')
@Controller('tipo-cultivos')
export class TipoCultivoController {
  constructor(private readonly tipoCultivoService: TipoCultivoService) {}

  // CREATE
  @Post()
  @ApiOperation({ summary: 'Create a new tipo cultivo' })
  @ApiResponse({ status: 201, description: 'Tipo cultivo created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createTipoCultivoDto: CreateTipoCultivoDto) {
    return await this.tipoCultivoService.create(createTipoCultivoDto);
  }

  // READ ALL
  @Get()
  @ApiOperation({ summary: 'Retrieve all tipo cultivos' })
  @ApiResponse({ status: 200, description: 'List of tipo cultivos' })
  async findAll() {
    return await this.tipoCultivoService.findAll();
  }

  // READ ONE
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a tipo cultivo by ID' })
  @ApiResponse({ status: 200, description: 'Tipo cultivo details' })
  @ApiResponse({ status: 404, description: 'Tipo cultivo not found' })
  async findOne(@Param('id') id: string) {
    return await this.tipoCultivoService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  @ApiOperation({ summary: 'Update a tipo cultivo by ID' })
  @ApiResponse({ status: 200, description: 'Tipo cultivo updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Tipo cultivo not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTipoCultivoDto: UpdateTipoCultivoDto,
  ) {
    return await this.tipoCultivoService.update(id, updateTipoCultivoDto);
  }

  // DELETE
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tipo cultivo by ID' })
  @ApiResponse({ status: 200, description: 'Tipo cultivo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tipo cultivo not found' })
  async remove(@Param('id') id: string) {
    return await this.tipoCultivoService.remove(id);
  }
}
