import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { Categoria } from './entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])], //  aquí registras la entidad
  controllers: [CategoriaController],
  providers: [CategoriaService],
  exports: [CategoriaService], // opcional si lo usas en otros módulos
})
export class CategoriaModule {}
