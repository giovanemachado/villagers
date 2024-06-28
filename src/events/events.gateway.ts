import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EVENT_TYPES } from './dto/event-data.dto';
import { UnprocessableEntityException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitEventByMatch(event: EVENT_TYPES, matchCode: string, data?: any) {
    if (!matchCode) {
      throw new UnprocessableEntityException(
        { matchCode },
        'Match Code is invalid.',
      );
    }

    const eventName = `${event}_${matchCode}`;

    console.log('EVENT EMITTED: ', eventName, JSON.stringify(data));
    this.server.emit(eventName, { ...data });
  }
}
