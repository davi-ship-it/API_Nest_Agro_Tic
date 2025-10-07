import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Raw } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { Express } from 'express';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
  ) {}

  async create(dto: CreateInventarioDto, file?: Express.Multer.File) {
    // Convierte a número solo las propiedades que deben serlo.
    // Los UUIDs (fkCategoriaId, fkBodegaId) ya son strings, así que no se tocan.
    // Con ValidationPipe(transform:true), la conversión a número es automática.
    // Ya no es necesario hacerlo manualmente aquí.
    const inventarioData = { ...dto, ...(file && { imgUrl: file.filename }) };
    const inventario = this.inventarioRepo.create(inventarioData);
    return await this.inventarioRepo.save(inventario);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.inventarioRepo.findAndCount({
      relations: ['categoria', 'bodega', 'movimientos'],
      skip,
      take: limit,
    });
    const itemsWithAvailable = items.map(item => {
      const movimientos = item.movimientos || [];
      const reservedStock = movimientos.reduce((sum, m) => sum + (m.stockReservado || 0), 0);
      const surplusStock = movimientos.reduce((sum, m) => sum + (Number(m.stockDevueltoSobrante) || 0), 0);
      const availableStock = item.stock - reservedStock;

      return {
        ...item,
        stock_disponible: Math.max(0, availableStock),
        stock_sobrante: surplusStock,
      };
    });
    return { items: itemsWithAvailable, total };
  }

  async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.inventarioRepo.findAndCount({
      where: {
        nombre: Raw((alias) => `${alias} ILIKE :query`, { query: `%${query}%` }),
      },
      relations: ['categoria', 'bodega', 'movimientos'],
      skip,
      take: limit,
    });
    const itemsWithAvailable = items.map(item => {
      const movimientos = item.movimientos || [];
      const reservedStock = movimientos.reduce((sum, m) => sum + (m.stockReservado || 0), 0);
      const surplusStock = movimientos.reduce((sum, m) => sum + (Number(m.stockDevueltoSobrante) || 0), 0);
      const availableStock = item.stock - reservedStock;

      return {
        ...item,
        stock_disponible: Math.max(0, availableStock),
        stock_sobrante: surplusStock,
      };
    });
    return { items: itemsWithAvailable, total };
  }

  async findOne(id: string) {
    const item = await this.inventarioRepo.findOne({ where: { id } });
    if (!item)
      throw new NotFoundException(`Inventario con ID ${id} no encontrado.`);
    return item;
  }

  async update(
    id: string,
    dto: UpdateInventarioDto,
    file?: Express.Multer.File,
  ) {
    // 1. Aseguramos que el item exista. findOne ya lanza la excepción si no lo encuentra.
    const item = await this.findOne(id); // Esto también obtiene la URL de la imagen antigua
    const oldImgUrl = item.imgUrl;

    // 2. Preparamos los datos, la conversión a número es automática
    // La conversión a número también es automática para el DTO de actualización
    // gracias al ValidationPipe global.
    const updateData = { ...dto, ...(file && { imgUrl: file.filename }) };

    // 3. Usamos merge para fusionar los nuevos datos en la entidad existente.
    const itemActualizado = this.inventarioRepo.merge(item, updateData);
    const savedItem = await this.inventarioRepo.save(itemActualizado);

    // 4. Si se subió un archivo nuevo y existía uno antiguo, eliminamos el antiguo.
    if (file && oldImgUrl) {
      try {
        // Asumiendo que 'uploads' está en la raíz del proyecto
        const imagePath = join(process.cwd(), 'uploads', oldImgUrl);
        await unlink(imagePath);
      } catch (error) {
        // Es buena idea loggear el error, pero no detener la ejecución
        console.error(
          `Error al eliminar la imagen antigua ${oldImgUrl}:`,
          error,
        );
      }
    }

    return savedItem;
  }

  async remove(id: string) {
    const item = await this.findOne(id); // Primero encontramos el item para obtener su imgUrl
    const result = await this.inventarioRepo.delete(id); // Luego lo eliminamos de la DB

    // Si el item tenía una imagen, la eliminamos del servidor.
    if (item.imgUrl) {
      try {
        const imagePath = join(process.cwd(), 'uploads', item.imgUrl);
        await unlink(imagePath);
      } catch (error) {
        console.error(`Error al eliminar la imagen ${item.imgUrl}:`, error);
      }
    }
    return { message: `Inventario con ID ${id} eliminado correctamente.` };
  }

  async getAvailableStock(id: string): Promise<number> {
    const item = await this.inventarioRepo.findOne({
      where: { id },
      relations: ['movimientos'],
    });
    if (!item) throw new NotFoundException(`Inventario con ID ${id} no encontrado.`);

    const movimientos = item.movimientos || [];
    const reservedStock = movimientos.reduce((sum, m) => sum + (m.stockReservado || 0), 0);
    const surplusStock = movimientos.reduce((sum, m) => sum + (Number(m.stockDevueltoSobrante) || 0), 0);
    const availableStock = item.stock - reservedStock;

    return Math.max(0, availableStock);
  }

  async validateStockAvailability(id: string, requestedQuantity: number): Promise<boolean> {
    const availableStock = await this.getAvailableStock(id);
    return availableStock >= requestedQuantity;
  }
}
