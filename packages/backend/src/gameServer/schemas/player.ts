// An abstract player object, demonstrating a potential 2D world position
import { Schema, type } from '@colyseus/schema';

export class Player extends Schema {
  @type('number')
  x: number = 0.0;

  @type('number')
  y: number = 0.0;

  @type('number')
  rotation: number = 0.0;

  @type('string')
  uid: string = ' ';

  @type('number')
  score: number = 0.0;

  @type('number')
  hp: number = 0.0;

  @type('string')
  name: string = ' ';

  @type('boolean')
  invincible: boolean = false;
}
