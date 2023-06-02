import { GameScene } from '../game-scene';
import { uploadScore } from './score';

export const createTexts = (gamescene: GameScene) => {
  // since now the camera is already following the player it is easier to add text here because you can just get the center
  gamescene.playerHpGameObject = gamescene.add
    .text(gamescene.cameras.main.centerX - 35, gamescene.cameras.main.centerY + 50, `HP: ${gamescene.playerHP.toString()} %`)
    .setScrollFactor(0);

  gamescene.userNameGameObject = gamescene.add
    .text(gamescene.cameras.main.centerX - 20, gamescene.cameras.main.centerY - 80, gamescene.userName)
    .setScrollFactor(0);

  gamescene.playerShootPowerGameObject = gamescene.add
    .text(gamescene.cameras.main.centerX - 35, gamescene.cameras.main.centerY + 65, `SP: ${gamescene.playerSP.toString()} P`)
    .setScrollFactor(0);

  // button to quit game
  const quitText: string = 'quit game';
  const fontSizePx: number = 24;
  // approximate width of text based on characters and font size
  const textWidthPx: number = (quitText.length * fontSizePx) / 2;

  const buttonY: number = 20 + fontSizePx;
  const buttonX: number = gamescene.game.canvas.width - textWidthPx;

  const buttonQuit = gamescene.add.text(buttonX, buttonY, quitText).setScrollFactor(0);

  buttonQuit.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
    const url: string = window.location.href;
    const splitted = url.split('/');
    uploadScore(gamescene.userName, gamescene.score, gamescene);
    window.localStorage.setItem('enableTheme', 'true');
    window.location.replace(`${splitted[0]}//${splitted[2]}/`);
  });
};
