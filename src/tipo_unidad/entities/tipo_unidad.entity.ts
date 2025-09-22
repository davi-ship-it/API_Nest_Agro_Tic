// File: src/entities/tipo_unidad/tipo_unidad.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
} from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity('tipo_unidad')
@Unique(['nombre']) // El nombre de la unidad debe ser único
@Unique(['simbolo']) // El símbolo también debe ser único
export class TipoUnidad {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_tipo_unidad' })
  id: string;

  @Column({ name: 'tip_nombre', type: 'varchar', length: 50 })
  nombre: string;

  @Column({ name: 'tip_simbolo', type: 'varchar', length: 10 })
  simbolo: string;

  @OneToMany(() => Categoria, (c) => c.tipoUnidad)
  categorias?: Categoria[];
}
