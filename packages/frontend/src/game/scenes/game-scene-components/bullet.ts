import { GameScene } from '../game-scene';

export type Bullet = {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  lifeTime: number;
  owner: string;
};

export type BulletProps = {
  playerX: number;
  playerY: number;
  playerId: string;
  active: boolean;
  rotation: number;
};

// destroys bullets if lifetime is over
export const destroyBullets = (gamescene: GameScene) => {
  for (let index = 0; index < gamescene.bullets.length; index++) {
    if (gamescene.time.now > gamescene.bullets[index].lifeTime) {
      gamescene.bulletsGroup.remove(gamescene.bullets[index].sprite);
      gamescene.otherbulletsGroup.remove(gamescene.bullets[index].sprite);
      gamescene.bullets[index].sprite.destroy();
      gamescene.bullets.splice(index, 1);
    }
  }
};

// destroys a specific bullet
export const destroyBullet = (bulletToRemove: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, gamescene: GameScene) => {
  for (let index = 0; index < gamescene.bullets.length; index++) {
    if (gamescene.bullets[index].sprite === bulletToRemove) {
      gamescene.bulletsGroup.remove(gamescene.bullets[index].sprite);
      gamescene.bullets[index].sprite.destroy();
      gamescene.bullets.splice(index, 1);
      break;
    }
  }
};
