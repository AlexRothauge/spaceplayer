import { MapSchema } from '@colyseus/schema';
import { GameScene } from '../game-scene';

export type enemyProps = {
  x: number;
  y: number;
  id: number;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  tweenMap: MapSchema<TweenProps>;
};

export type TweenProps = {
  x: number;
  y: number;
  ease: string;
  duration: number;
};

export const checkEnemyInList = (id: number, gamescene: GameScene) => {
  for (let index = 0; index < gamescene.enemyList.length; index++) {
    if (id === gamescene.enemyList[index].id) {
      return index;
    }
  }
  return -1;
};

export const addEnemys = (gamescene: GameScene) => {
  gamescene.gameRoom.then((room) => {
    room.state.enemys.forEach((value, key) => {
      const index = checkEnemyInList(value.id, gamescene);
      if (index === -1) {
        const jellyEnemy = gamescene.physics.add.sprite(value.x, value.y, 'jellyEnemy');
        jellyEnemy.setData('id', value.id);
        jellyEnemy.body.immovable = true;
        jellyEnemy.body.moves = false;
        const tweenArray: {
          x: number;
          y: number;
          ease: string;
          duration: number;
        }[] = [];
        value.tweenMap.forEach((valueinner, keyinner) => {
          tweenArray.push({ x: valueinner.x, y: valueinner.y, ease: valueinner.ease, duration: valueinner.duration });
        });
        gamescene.tweens.timeline({
          targets: jellyEnemy,
          // -1 means infinite loops
          loop: -1,

          tweens: tweenArray,
        });
        gamescene.enemies.add(jellyEnemy);
        gamescene.enemyList.push({
          id: value.id,
          x: value.x,
          y: value.y,
          sprite: jellyEnemy,
          tweenMap: value.tweenMap,
        });
      }
    });
  });
};
