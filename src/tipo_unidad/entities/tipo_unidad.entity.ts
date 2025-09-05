// File: src/entities/tipo_unidad/tipo_unidad.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity('tipo_unidad')
export class TipoUnidad {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_tipo_unidad' })
  id: string;

  @Column({ name: 'tip_nombre', type: 'varchar', length: 10 })
  nombre: string;

  @OneToMany(() => Categoria, (c) => c.tipoUnidad)
  categorias?: Categoria[];
}

