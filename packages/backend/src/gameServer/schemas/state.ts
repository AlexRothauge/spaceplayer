import { MapSchema, Schema, type } from '@colyseus/schema';
import { Player } from './player';
import { Bullet } from './bullet';
import { Astroid } from './astroid';
import { Enemy } from './enemy';
import { PowerUP } from './powerup';

export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type([Bullet])
  bullets = new Bullet();

  @type('number')
  maxClients: number = 32;

  @type('number')
  maxAstroids: number = 20;

  @type('number')
  maxEnemys: number = 10;

  @type({ map: Astroid })
  astroids = new MapSchema<Astroid>();

  @type({ map: Enemy })
  enemys = new MapSchema<Enemy>();

  @type({ map: PowerUP })
  powerups = new MapSchema<PowerUP>();

  @type('number')
  map: number = 1;

  @type('number')
  emptyTimeStamp: number;

  @type('boolean')
  empty: boolean;
}
