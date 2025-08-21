// File: src/entities/venta/venta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cosecha } from '../../cosechas/entities/cosecha.entity';

@Entity('venta')
export class Venta {
  @PrimaryGeneratedColumn({ name: 'pk_id_venta' })
  id: number;

  @Column({ name: 'ven_cantidad', type: 'numeric', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ name: 'ven_fecha', type: 'date' })
  fecha: string;

  @Column({ name: 'fk_id_cosecha' })
  fkCosechaId: number;

  @Column({ name: 'ven_precio_kilo', type: 'numeric', nullable: true })
  precioKilo?: number;

  @Column({ name: 'ven_venta_total', type: 'numeric', nullable: true })
  ventaTotal?: number;

  @ManyToOne(() => Cosecha, (c) => c.ventas)
  @JoinColumn({ name: 'fk_id_cosecha' })
  cosecha?: Cosecha;
}
