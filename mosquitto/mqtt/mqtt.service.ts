// src/mqtt/mqtt.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;

  onModuleInit() {
    this.client = mqtt.connect('mqtt://test.mosquitto.org:1883');
    const topic = 'datos/agrotic';

    this.client.on('connect', () => {
      console.log('Conectado al broker MQTT');
      this.client.subscribe(topic, (err) => {
        if (!err) console.log('Suscrito al tópico:', topic);
      });
    });

    this.client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Datos recibidos del ESP32:', data);

        // Aquí podrías guardar los datos en tu BD
        // this.sensorService.saveData(data);

      } catch (e) {
        console.error('Error al procesar mensaje:', e);
      }
    });
  }
}

