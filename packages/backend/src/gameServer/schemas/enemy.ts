// An abstract player object, demonstrating a potential 2D world position
import { MapSchema, Schema, type } from '@colyseus/schema';
import { Tween } from './tween';

export class Enemy extends Schema {
  @type('number')
  x: number = 0.0;

  @type('number')
  y: number = 0.0;

  @type('number')
  id: number = 0;

  @type({ map: Tween })
  tweenMap = new MapSchema<Tween>();
}
