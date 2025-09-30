import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {
    // Crear la carpeta uploads si no existe
    const uploadPath = join(__dirname, '../../uploads');
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
  }

  private static fileInterceptorOptions = {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  };

@Post()
@UseInterceptors(FileInterceptor('imgUrl', InventarioController.fileInterceptorOptions))
create(
  
  @Body() dto: CreateInventarioDto,
  @UploadedFile() file?: Express.Multer.File,
  
) {
  return this.inventarioService.create(dto, file);
}

 @Put(':id')
@UseInterceptors(FileInterceptor('imgUrl', InventarioController.fileInterceptorOptions))
update(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() dto: UpdateInventarioDto,
  @UploadedFile() file?: Express.Multer.File,
) {
  return this.inventarioService.update(id, dto, file);
}


  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.inventarioService.findAll(pageNum, limitNum);
  }

  @Get('search/:query')
  search(@Param('query') query: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.inventarioService.search(query, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventarioService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventarioService.remove(id);
  }
}
