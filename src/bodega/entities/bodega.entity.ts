// File: src/entities/bodega/bodega.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';

@Entity('bodega')
export class Bodega {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_bodega' })
  id: string;

  @Column({ name: 'bod_numero', type: 'varchar', length: 15 })
  numero: string;

  @Column({ name: 'bod_nombre', type: 'varchar', length: 100 })
  nombre: string;

  @OneToMany(() => Inventario, (i) => i.bodega)
  inventarios?: Inventario[];
}
