import { Room, Client } from 'colyseus';
import { RoomToSave } from './schemas/RoomToSave';
import { StateGameRoom } from './schemas/StateGameRoom';
import { State } from './schemas/state';
import * as Colyseus from 'colyseus.js';

// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config({ path: '../../infra/env_vars/.env', example: '../../infra/env_vars/.env.example' });

export class MyRoom extends Room<StateGameRoom> {
  // When room is initialized
  onCreate(_OPTIONS: any) {
    this.autoDispose = false;

    this.setState(new StateGameRoom());

    const myRoomClient = new Colyseus.Client(`ws://${process.env.BACKEND_HOST}:5000`);

    this.onMessage('action', (client, message) => {
      console.log(client.sessionId, "sent 'action' message: ", message);
    });

    this.onMessage('created', (_CLIENT, message) => {
      const createdRoom = new RoomToSave();
      createdRoom.clients = message.clients;
      createdRoom.maxClients = message.maxClients;
      createdRoom.maxAstroids = message.maxAstroids;
      createdRoom.maxEnemys = message.maxEnemys;
      createdRoom.map = message.map;
      this.state.rooms.set(message.roomid, createdRoom);
    });

    // Message is received from a room if he is closed
    this.onMessage('disposedRoom', (_CLIENT, roomId) => {
      // delete closed room from state to prevent errors
      this.state.rooms.delete(roomId);
    });

    this.onMessage('message', (client, message) => {
      console.log('ChatRoom received message from', client.sessionId, ':', message);
      this.broadcast('messages', `(${this.state.rooms.size}) `);
    });

    this.onMessage('allrooms', (_CLIENT, _MESSAGE) => {
      this.state.rooms.forEach((value, key) => {
        const currentRoom: Promise<Colyseus.Room<State>> = myRoomClient.joinById(key, { type: 'myRoom' });
        currentRoom.then((groom) => {
          groom.send('getPlayers', '');
          groom.onMessage('roomPlayers', (numberofPlayers: number) => {
            const roomtosave = new RoomToSave();
            roomtosave.clients = numberofPlayers;
            roomtosave.maxClients = value.maxClients;
            roomtosave.maxAstroids = value.maxAstroids;
            roomtosave.maxEnemys = value.maxEnemys;
            roomtosave.map = value.map;
            this.state.rooms.set(key, roomtosave);
            groom.leave();
            this.broadcast('rooms', JSON.stringify(this.state.rooms));
          });
        });
      });
    });
  }

  // When client successfully join the room
  // tslint:disable-next-line:no-empty
  onJoin(_CLIENT: Client, _OPTIONS: any, _AUTH: any) {}

  // When a client leaves the room
  // tslint:disable-next-line:no-empty
  onLeave(_CLIENT: Client, _CONSENTED: boolean) {}

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  // tslint:disable-next-line:no-empty
  onDispose() {}
}
