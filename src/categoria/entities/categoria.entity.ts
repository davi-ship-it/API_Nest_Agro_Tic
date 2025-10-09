import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from '../../productos/entities/productos.entity';
import { TipoUnidad } from '../../tipo_unidad/entities/tipo_unidad.entity';

@Entity('categoria')
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ name: 'fk_tipo_unidad_id', nullable: true })
  fkTipoUnidadId?: string;

  @ManyToOne(() => TipoUnidad, (tu) => tu.categorias)
  @JoinColumn({ name: 'fk_tipo_unidad_id' })
  tipoUnidad?: TipoUnidad;

  @OneToMany(() => Producto, (p) => p.categoria)
  productos?: Producto[];
}
