// File: src/entities/movimientos/movimiento.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_movimiento' })
  id: string;

  @Column({ name: 'fk_id_inventario', type: 'uuid' })
  fkInventarioId: string;

  @Column({ name: 'mov_stock_reservado', type: 'numeric', nullable: true })
  stockReservado: number | null;

  @Column({ name: 'mov_stock_devuelto', type: 'numeric', nullable: true })
  stockDevuelto: number | null;

  @Column({ name: 'mov_stock_devuelto_sobrante', type: 'numeric', nullable: true })
  stockDevueltoSobrante: number | null;

  @Column({ name: 'mov_stock_reservado_sobrante', type: 'numeric', nullable: true })
  stockReservadoSobrante: number | null;

  @ManyToOne(() => Inventario, (i) => i.movimientos)
  @JoinColumn({ name: 'fk_id_inventario' })
  inventario?: Inventario;
}
