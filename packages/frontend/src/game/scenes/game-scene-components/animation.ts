import { GameScene } from '../game-scene';

export const playAnimation = (
  spriteX: number,
  spriteY: number,
  animationTitle: string,
  gamescene: GameScene,
  config: Phaser.Types.Animations.Animation,
) => {
  const animation = gamescene.add.sprite(spriteX, spriteY, animationTitle);
  gamescene.anims.create(config);
  animation.play(config.key!);
  animation.once('animationcomplete', () => {
    animation.destroy();
  });
};

export const createFogMove = (gamescene: GameScene) => {
  gamescene.anims.create({
    key: 'fogMove',
    repeat: -1,
    frameRate: 20,
    frames: gamescene.anims.generateFrameNames('fog', { start: 0, end: 15 }),
  });
};
