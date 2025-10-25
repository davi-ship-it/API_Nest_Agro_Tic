// File: src/mqtt_config/entities/mqtt_config.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Zona } from '../../zonas/entities/zona.entity';
import { MedicionSensor } from '../../medicion_sensor/entities/medicion_sensor.entity';

@Entity('mqtt_config')
export class MqttConfig {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_mqtt_config' })
  id: string;

  @Column({ name: 'mc_nombre', type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ name: 'mc_host', type: 'varchar', length: 255 })
  host: string;

  @Column({ name: 'mc_port', type: 'integer' })
  port: number;

  @Column({ name: 'mc_protocol', type: 'varchar', length: 10 })
  protocol: string;

  @Column({ name: 'mc_topic_base', type: 'varchar', length: 255 })
  topicBase: string;

  @Column({ name: 'mc_activa', type: 'boolean', default: true })
  activa: boolean;

  @Column({ name: 'fk_id_zona' })
  fkZonaId: string;

  @OneToOne(() => Zona, (z) => z.mqttConfig)
  @JoinColumn({ name: 'fk_id_zona' })
  zona?: Zona;

  @OneToMany(() => MedicionSensor, (ms) => ms.mqttConfig)
  mediciones?: MedicionSensor[];
}