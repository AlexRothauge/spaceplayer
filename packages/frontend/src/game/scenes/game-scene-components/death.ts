import { UserInfo } from '../death-scene';
import { GameScene } from '../game-scene';
import { uploadScore } from './score';
import { playGameOverSound } from './sound';

export const youDied = (gamescene: GameScene) => {
  uploadScore(gamescene.userName, gamescene.score, gamescene);

  playGameOverSound(gamescene);

  const info: UserInfo = {
    userName: gamescene.userName,
    score: gamescene.score,
    highScore: gamescene.highScore,
  };
  // show the you died screen
  gamescene.scene.start('Death', info);
};
