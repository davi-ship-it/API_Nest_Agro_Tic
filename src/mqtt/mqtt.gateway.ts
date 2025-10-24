import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MqttGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MqttGateway');

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Emitir nueva lectura a todos los clientes conectados
  emitNuevaLectura(lectura: any) {
    this.server.emit('lecturaNueva', lectura);
  }

  // Emitir estado de conexión MQTT
  emitEstadoConexion(estado: { zonaId: string; conectado: boolean; mensaje?: string }) {
    this.server.emit('estadoConexion', estado);
  }

  // Emitir señal de inicio de conexión (opcional, para feedback inmediato)
  emitInicioConexion(zonaId: string, mensaje: string) {
    this.server.emit('inicioConexion', { zonaId, mensaje });
  }
}