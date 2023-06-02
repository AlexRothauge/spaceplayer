import { Schema, type } from '@colyseus/schema';

export class RoomToSave extends Schema {
  @type('number')
  clients: number = 0;

  @type('number')
  maxClients: number = 32;

  @type('number')
  maxAstroids: number = 20;

  @type('number')
  maxEnemys: number = 10;

  @type('number')
  map: number = 10;
}
