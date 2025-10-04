// File: src/entities/inventario_x_actividades/inventario_x_actividades.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { Actividad } from '../../actividades/entities/actividades.entity';

@Entity('inventario_x_actividades')
export class InventarioXActividad {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_inventario_x_actividad' })
  id: string;

  @Column({ name: 'fk_id_inventario', nullable: true })
  fkInventarioId?: string;

  @Column({ name: 'fk_id_actividad', nullable: true })
  fkActividadId?: string;

  @ManyToOne(() => Inventario, (i) => i.actividades)
  @JoinColumn({ name: 'fk_id_inventario' })
  inventario?: Inventario;

  @ManyToOne(() => Actividad, (a) => a.inventarioUsado)
  @JoinColumn({ name: 'fk_id_actividad' })
  actividad?: Actividad;
}

