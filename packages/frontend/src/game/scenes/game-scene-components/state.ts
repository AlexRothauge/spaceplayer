import { MapSchema } from '@colyseus/schema';
import { astroidProps } from './astroid';
import { BulletProps } from './bullet';
import { enemyProps } from './enemy';
import { PlayerProps } from './players';
import { PowerUpProps } from './powerup';

export type State = {
  players: MapSchema<PlayerProps>;
  bullets: MapSchema<BulletProps>;
  maxAstroids: number;
  maxEnemys: number;
  astroids: MapSchema<astroidProps>;
  enemys: MapSchema<enemyProps>;
  powerups: MapSchema<PowerUpProps>;
};
