// An abstract player object, demonstrating a potential 2D world position
import { Schema, type } from '@colyseus/schema';

export class PowerUP extends Schema {
  @type('number')
  x: number = 0.0;

  @type('number')
  y: number = 0.0;

  @type('number')
  id: number = 0;

  @type('string')
  type: string = '';
}
