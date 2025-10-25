// File: src/entities/medicion_sensor/medicion_sensor.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MqttConfig } from '../../mqtt_config/entities/mqtt_config.entity';
import { Zona } from '../../zonas/entities/zona.entity';

@Entity('medicion_sensor')
export class MedicionSensor {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_medicion' })
  id: string;

  @Column({ name: 'med_key', type: 'varchar', length: 50 })
  key: string; // e.g., "temperatura", "humedad"

  @Column({ name: 'med_valor', type: 'numeric', precision: 10, scale: 2 })
  valor: number;

  @Column({ name: 'med_unidad', type: 'varchar', length: 20 })
  unidad: string; // e.g., "°C", "%"

  @Column({ name: 'med_fecha_medicion', type: 'timestamp' })
  fechaMedicion: Date;

  @Column({ name: 'fk_id_mqtt_config' })
  fkMqttConfigId: string;

  @Column({ name: 'fk_id_zona' })
  fkZonaId: string;

  @ManyToOne(() => MqttConfig, (mc) => mc.mediciones)
  @JoinColumn({ name: 'fk_id_mqtt_config' })
  mqttConfig?: MqttConfig;

  @ManyToOne(() => Zona, (z) => z.mediciones)
  @JoinColumn({ name: 'fk_id_zona' })
  zona?: Zona;
}
