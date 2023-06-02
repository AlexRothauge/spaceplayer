import { GameScene } from '../game-scene';

export type astroidProps = {
  x: number;
  y: number;
  id: number;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
};

export const addAstroids = (gamescene: GameScene) => {
  gamescene.gameRoom.then((room) => {
    room.state.astroids.forEach((value) => {
      const index = checkAstroidInList(value.id, gamescene);
      if (index === -1) {
        const asteroid = gamescene.physics.add.sprite(value.x, value.y, 'asteroid');
        asteroid.setData('id', value.id);
        asteroid.body.immovable = true;
        gamescene.asteroids.add(asteroid);
        gamescene.astroidList.push({ id: value.id, x: value.x, y: value.y, sprite: asteroid });
      }
    });
  });
};

export const checkAstroidInList = (id: number, gamescene: GameScene) => {
  for (let index = 0; index < gamescene.astroidList.length; index++) {
    if (id === gamescene.astroidList[index].id) {
      return index;
    }
  }
  return -1;
};
