import { GameScene } from '../game-scene';

export const playGameOverSound = (gamescene: GameScene) => {
  gamescene.sound.stopByKey('backgroundSound');
  gamescene.sound.play('gameOver');
  gamescene.sound.play('gameOverMusic', {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: false,
    delay: 2.5,
  });
};

export const playSound = (
  soundTitle: string,
  gamescene: GameScene,
  extra?: Phaser.Types.Sound.SoundConfig,
  spriteOneX?: number,
  spriteOneY?: number,
  spriteTwoX?: number,
  spriteTwoY?: number,
) => {
  if (spriteOneX && spriteOneY && spriteTwoX && spriteTwoY) {
    const distance: number = Phaser.Math.Distance.Between(spriteOneX, spriteOneY, spriteTwoX, spriteTwoY);
    if (distance < 790) {
      gamescene.sound.play(soundTitle, extra);
    }
  } else {
    gamescene.sound.play(soundTitle, extra);
  }
};
