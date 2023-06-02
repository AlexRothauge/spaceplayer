import { GameScene } from '../game-scene';
import { destroyBullet } from './bullet';
import { youDied } from './death';
import { spawnRandomPowerUPbyChance, startFasterShooting, startInvincible } from './powerup';

export const collisionShipEnemyHandler = (
  ship: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  gamescene: GameScene,
) => {
  const enemyID: string = enemy.getData('id');

  gamescene.gameRoom.then((room) => {
    room.send('destroyEnemy', enemyID);
  });

  if (gamescene.playerHP > 0) {
    // Reduce Ship HP

    // remove from collision, sprite gets destroyed by broadcast
    if (gamescene.enemies.remove(enemy)) {
      if (!gamescene.invincible) {
        gamescene.playerHP -= 10;
        // Update Text
        // tslint:disable-next-line:prefer-template
        gamescene.playerHpGameObject.setText(`HP: ${gamescene.playerHP.toString()} %`);
      }
    }

    // Update Text
    // tslint:disable-next-line:prefer-template
    gamescene.playerHpGameObject.setText(`HP: ${gamescene.playerHP.toString()} %`);
  } else {
    // Player died
    // Remove Player Ship from Map and Load "You Died" screen with Highscore
    youDied(gamescene);
  }
};

export const collisionShipPowerUPHandler = (
  ship: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  powerUp: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  gamescene: GameScene,
) => {
  const powerUpID: string = powerUp.getData('id');
  gamescene.gameRoom.then((room) => {
    room.send('pickUpPowerUp', powerUpID);
  });

  if (gamescene.powerups.remove(powerUp)) {
    switch (powerUp.getData('type')) {
      case 'HP':
        gamescene.playerHP += 30;
        if (gamescene.playerHP > 100) {
          gamescene.playerHP = 100;
        }
        gamescene.playerHpGameObject.setText(`HP: ${gamescene.playerHP.toString()} %`);
        break;

      case 'SHIELD':
        startInvincible(gamescene);
        break;

      case 'SHOOTING':
        startFasterShooting(gamescene);
        break;

      case 'ENERGY':
        gamescene.playerSP += 200;
        gamescene.playerShootPowerGameObject.setText(`SP: ${gamescene.playerSP.toString()} P`);
        break;

      default:
        break;
    }
  }
};

export const collisionShipAsteroidHandler = (
  ship: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  asteroid: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  gamescene: GameScene,
) => {
  const astroidID: string = asteroid.getData('id');
  gamescene.gameRoom.then((room) => {
    room.send('destroyAstroid', astroidID);
  });

  if (gamescene.asteroids.remove(asteroid)) {
    if (gamescene.playerHP > 0) {
      // Reduce Ship HP
      if (!gamescene.invincible) {
        gamescene.playerHP -= 5;
        // Update Text
        gamescene.playerHpGameObject.setText(`HP: ${gamescene.playerHP.toString()} %`);
      }

      // Delete Asteriod from map
    } else {
      // Player died
      // Remove Player Ship from Map and Load "You Died" screen with Highscore
      youDied(gamescene);
    }
  }
};

export const collisionBulletEnemyHandler = (
  bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  gamescene: GameScene,
) => {
  const enemyID: string = enemy.getData('id');

  gamescene.gameRoom.then((room) => {
    room.send('destroyEnemy', enemyID);
    room.send('updateScore', '20');
  });

  const bulletSprite = bullet as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  // removes bullet completly
  destroyBullet(bulletSprite, gamescene);

  // remove from collision, sprite gets destroyed by broadcast
  if (gamescene.enemies.remove(enemy)) {
    gamescene.score += 20;
  }
};

export const collisionBulletAsteroidHandler = (
  bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  asteroid: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  gamescene: GameScene,
) => {
  const astroidID: string = asteroid.getData('id');
  gamescene.gameRoom.then((room) => {
    room.send('destroyAstroid', astroidID);
    room.send('updateScore', '10');
  });

  const bulletSprite = bullet as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  // removes bullet completly
  destroyBullet(bulletSprite, gamescene);

  // remove from collision, sprite gets destroyed by broadcast
  if (gamescene.asteroids.remove(asteroid)) {
    gamescene.score += 10;
    spawnRandomPowerUPbyChance(asteroid.body.x, asteroid.body.y, gamescene);
  }
};

export const collisionBulletShipHandler = (
  ship: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  gamescene: GameScene,
) => {
  const bulletSprite = bullet as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  // removes bullet completly
  destroyBullet(bulletSprite, gamescene);
};

export const collisionMyShipEnemyBulletHandler = (
  myship: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  otherbullet: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  gamescene: GameScene,
) => {
  const bulletSprite = otherbullet as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  const otherShipID: string = bulletSprite.getData('id');
  // removes bullet completly
  destroyBullet(bulletSprite, gamescene);
  if (!gamescene.invincible) {
    if (gamescene.playerHP - 20 > 0) {
      // Reduce Ship HP
      gamescene.playerHP -= 20;
      // Update Text
      gamescene.playerHpGameObject.setText(`HP: ${gamescene.playerHP.toString()} %`);
    } else {
      // Player died
      gamescene.gameRoom.then((room) => {
        room.send('destroyShip', otherShipID);
      });
      // Remove Player Ship from Map and Load "You Died" screen with Highscore
      youDied(gamescene);
    }
  }
};

export const collisionAstroidEnemyBulletHandler = (
  asteroid: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  otherbullet: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  gamescene: GameScene,
) => {
  const bulletSprite = otherbullet as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  destroyBullet(bulletSprite, gamescene);
};

export const collisionJellyEnemyBulletHandler = (
  enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  otherbullet: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  gamescene: GameScene,
) => {
  const bulletSprite = otherbullet as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  destroyBullet(bulletSprite, gamescene);
};
