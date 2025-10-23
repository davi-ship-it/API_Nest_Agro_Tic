import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/productos.entity';
import { CreateProductosDto } from './dto/create-productos.dto';
import { UpdateProductosDto } from './dto/update-productos.dto';
import { CreateProductoWithLoteDto } from './dto/create-producto-with-lote.dto';
import { LotesInventario } from '../lotes_inventario/entities/lotes_inventario.entity';
import { MovimientosInventario } from '../movimientos_inventario/entities/movimientos_inventario.entity';
import { TipoMovimiento } from '../tipos_movimiento/entities/tipos_movimiento.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectRepository(MovimientosInventario)
    private readonly movimientosInventarioRepo: Repository<MovimientosInventario>,
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepo: Repository<TipoMovimiento>,
  ) {}

  async create(createDto: CreateProductosDto): Promise<Producto> {
    const entity = this.productoRepo.create(createDto);
    return await this.productoRepo.save(entity);
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepo.find({
      relations: ['categoria', 'unidadMedida'],
    });
  }

  async findOne(id: string): Promise<Producto> {
    const entity = await this.productoRepo.findOne({
      where: { id },
      relations: ['categoria', 'unidadMedida'],
    });
    if (!entity)
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return entity;
  }

  async update(id: string, updateDto: UpdateProductosDto): Promise<Producto> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return await this.productoRepo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.productoRepo.remove(entity);
  }

  private async createMovementRecord(
    queryRunner: any,
    loteId: string,
    tipoMovimientoNombre: string,
    cantidad: number,
    observacion: string,
  ): Promise<void> {
    try {
      // Find the movement type
      const tipoMovimiento = await queryRunner.manager.findOne(TipoMovimiento, {
        where: { nombre: tipoMovimientoNombre },
      });

      if (!tipoMovimiento) {
        console.warn(`Tipo de movimiento "${tipoMovimientoNombre}" no encontrado.`);
        return;
      }

      // Create the movement record
      const movimiento = queryRunner.manager.create(MovimientosInventario, {
        fkLoteId: loteId,
        fkTipoMovimientoId: tipoMovimiento.id,
        cantidad: cantidad,
        fechaMovimiento: new Date(),
        observacion: observacion,
      });

      await queryRunner.manager.save(MovimientosInventario, movimiento);
      console.log(`✅ Movimiento de ${tipoMovimientoNombre} registrado para lote ${loteId}`);
    } catch (error) {
      console.error(`❌ Error creando movimiento: ${error.message}`);
    }
  }

  async createWithLote(createDto: CreateProductoWithLoteDto): Promise<Producto> {
    // Start transaction
    const queryRunner = this.productoRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create product
      const producto = this.productoRepo.create({
        nombre: createDto.nombre,
        descripcion: createDto.descripcion,
        sku: createDto.sku,
        precioCompra: createDto.precioCompra,
        capacidadPresentacion: createDto.capacidadPresentacion,
        fkCategoriaId: createDto.fkCategoriaId,
        fkUnidadMedidaId: createDto.fkUnidadMedidaId,
        vidaUtilPromedioPorUsos: createDto.vidaUtilPromedioPorUsos,
      });
      const savedProducto = await queryRunner.manager.save(Producto, producto);

      // Calculate cantidadDisponible = stock * capacidadPresentacion
      const cantidadDisponible = createDto.stock * (savedProducto.capacidadPresentacion || 1);

      // Create lot inventory
      const loteInventario = queryRunner.manager.create(LotesInventario, {
        fkProductoId: savedProducto.id,
        fkBodegaId: createDto.fkBodegaId,
        cantidadDisponible,
        stock: createDto.stock,
        esParcial: false, // Default to false
        cantidadParcial: 0, // Default to 0
        fechaVencimiento: createDto.fechaVencimiento ? new Date(createDto.fechaVencimiento) : undefined,
      });
      const savedLote = await queryRunner.manager.save(LotesInventario, loteInventario);

      // Create movement record for ENTRADA
      await this.createMovementRecord(queryRunner, savedLote.id, 'Entrada', cantidadDisponible, `Entrada de producto: ${savedProducto.nombre}`);

      // Commit transaction
      await queryRunner.commitTransaction();

      return savedProducto;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
}
