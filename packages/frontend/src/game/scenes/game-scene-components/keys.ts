import { GameScene } from '../game-scene';

export const addKeys = (gamescene: GameScene) => {
  // This is a nice helper Phaser provides to create listeners for some of the most common keys.
  gamescene.cursorKeys = gamescene.input.keyboard.createCursorKeys();

  // for shooting
  gamescene.space = gamescene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // W-A-S-D as additional controlls
  gamescene.w = gamescene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  gamescene.a = gamescene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  gamescene.s = gamescene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  gamescene.d = gamescene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
};
