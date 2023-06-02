import { Schema, type } from '@colyseus/schema';

export class Tween extends Schema {
  @type('number')
  x: number = 0.0;

  @type('number')
  y: number = 0.0;

  @type('string')
  ease: string = 'Sine.easeInOut';

  @type('number')
  duration: number = 0.0;
}
