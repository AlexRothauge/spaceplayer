import { GameScene } from '../game-scene';
import { createFogMove } from './animation';

export const createFog = (gamescene: GameScene) => {
  for (let x = -2000; x <= 2000; x = x + 200) {
    const fogSprite = gamescene.add.sprite(x, -2100, 'fog');
    createFogMove(gamescene);
    fogSprite.play('fogMove');
  }

  for (let x = -2000; x <= 2000; x = x + 200) {
    const fogSprite = gamescene.add.sprite(x, 2100, 'fog');
    createFogMove(gamescene);
    fogSprite.play('fogMove');
  }

  for (let y = -2000; y <= 2000; y = y + 200) {
    const fogSprite = gamescene.add.sprite(-2100, y, 'fog');
    createFogMove(gamescene);
    fogSprite.play('fogMove');
  }

  for (let y = -2000; y <= 2000; y = y + 200) {
    const fogSprite = gamescene.add.sprite(2100, y, 'fog');
    createFogMove(gamescene);
    fogSprite.play('fogMove');
  }
};
