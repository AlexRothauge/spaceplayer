import { MapSchema, Schema, type } from '@colyseus/schema';
import { RoomToSave } from './RoomToSave';
export class StateGameRoom extends Schema {
  @type({ map: RoomToSave })
  rooms = new MapSchema<RoomToSave>();
}
