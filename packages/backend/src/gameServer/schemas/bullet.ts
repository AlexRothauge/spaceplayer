import { Schema, type } from '@colyseus/schema';

export class Bullet extends Schema {
  @type('number')
  playerX: number = 0.0;

  @type('number')
  playerY: number = 0.0;

  @type('string')
  playerId: string = ' ';

  @type('boolean')
  active: boolean = true;

  @type('number')
  rotation: number = 0.0;
}
