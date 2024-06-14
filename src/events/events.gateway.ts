import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EVENT_TYPES } from './dto/event-data.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitEvent(event: EVENT_TYPES, data?: any) {
    console.log('EVENT EMITTED: ', event, JSON.stringify(data));
    this.server.emit(event, { ...data });
  }
}
