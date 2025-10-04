// File: src/entities/movimientos/movimiento.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_movimiento' })
  id: string;

  @Column({ name: 'fk_id_inventario', type: 'uuid' })
  fkInventarioId: string;

  @Column({ name: 'mov_stock_reservado', type: 'numeric' })
  stockReservado: number;

  @Column({ name: 'mov_stock_devuelto', type: 'numeric' })
  stockDevuelto: number;

  @ManyToOne(() => Inventario, (i) => i.movimientos)
  @JoinColumn({ name: 'fk_id_inventario' })
  inventario?: Inventario;
}
