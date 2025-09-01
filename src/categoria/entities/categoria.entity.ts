// File: src/entities/categoria/categoria.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TipoUnidad } from '../../tipo_unidad/entities/tipo_unidad.entity';
import { Inventario } from '../../inventario/entities/inventario.entity';

@Entity('categoria')
export class Categoria {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_categoria' })
  id: string;

  @Column({ name: 'cat_nombre', type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'fk_id_tipo_unidad' })
  fkTipoUnidadId: number;

  @ManyToOne(() => TipoUnidad, (t) => t.categorias)
  @JoinColumn({ name: 'fk_id_tipo_unidad' })
  tipoUnidad?: TipoUnidad;

  @OneToMany(() => Inventario, (i) => i.categoria)
  inventarios?: Inventario[];
}

