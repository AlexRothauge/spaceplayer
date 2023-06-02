import { GameScene } from '../game-scene';

export const createParticles = (gamescene: GameScene) => {
  gamescene.particles = gamescene.add.particles('flares');

  gamescene.emitter = gamescene.particles.createEmitter({
    frame: 'yellow', // blue, green, red, white, yellow
    speed: 100,
    lifespan: {
      onEmit: () => {
        return Phaser.Math.Percent(gamescene.shipPlayer.body.speed, 0, 300) * 2000;
      },
    },

    alpha: {
      onEmit: () => {
        return Phaser.Math.Percent(gamescene.shipPlayer.body.speed, 0, 300);
      },
    },

    angle: {
      onEmit: () => {
        const v = Phaser.Math.Between(-10, 10);
        return gamescene.shipPlayer.angle - 180 + v;
      },
    },

    scale: { start: 0.6, end: 0 },
    blendMode: 'ADD',
  });

  gamescene.particles.setDepth(0);

  gamescene.emitter.startFollow(gamescene.shipPlayer);
};
