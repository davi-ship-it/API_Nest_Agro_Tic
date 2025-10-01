// File: src/entities/inventario/inventario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { Bodega } from '../../bodega/entities/bodega.entity';
import { InventarioXActividad } from '../../inventario_x_actividades/entities/inventario_x_actividades.entity';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_inventario' })
  id: string;

  @Column({ name: 'inv_nombres', type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'inv_descripcion', type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'inv_stock', type: 'integer' })
  stock: number;

  @Column({ name: 'inv_precio', type: 'numeric' })
  precio: number;

  @Column({ name: 'inv_capacidad_unidad', type: 'numeric', precision: 10, scale: 2, nullable: true })
  capacidadUnidad: number;

  @Column({ name: 'ivn_fecha_vencimiento', type: 'date', nullable: true })
  fechaVencimiento?: string;

  @Column({ name: 'inv_img_url', type: 'varchar', length: 255, nullable: true })
  imgUrl?: string;

  @Column({ name: 'fk_id_categoria', type: 'uuid', nullable: true })
  fkCategoriaId: string;

  @Column({ name: 'fk_id_bodega', type: 'uuid', nullable: true })
  fkBodegaId: string;

  @ManyToOne(() => Categoria, (c) => c.inventarios)
  @JoinColumn({ name: 'fk_id_categoria' })
  categoria: Categoria;

  @ManyToOne(() => Bodega, (b) => b.inventarios)
  @JoinColumn({ name: 'fk_id_bodega' })
  bodega: Bodega;

  @OneToMany(() => InventarioXActividad, (ixa) => ixa.inventario)
  actividades?: InventarioXActividad[];
}
