import { GameScene } from '../game-scene';
import { getRandomInt } from './getRandomInt';

export type PowerUpProps = {
  x: number;
  y: number;
  id: number;
  type: string;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
};

export const checkPowerUPInList = (id: number, gamescene: GameScene) => {
  for (let index = 0; index < gamescene.powerUPList.length; index++) {
    if (id === gamescene.powerUPList[index].id) {
      return index;
    }
  }
  return -1;
};

export const addPowerUPs = (gamescene: GameScene) => {
  gamescene.gameRoom.then((room) => {
    room.state.powerups.forEach((value) => {
      const index = checkPowerUPInList(value.id, gamescene);
      if (index === -1) {
        switch (value.type) {
          case 'HP':
            const powerUpHeart = gamescene.physics.add.sprite(value.x, value.y, 'powerUpHeart');
            powerUpHeart.setData('id', value.id);
            powerUpHeart.setData('type', value.type);
            powerUpHeart.body.immovable = true;
            gamescene.powerups.add(powerUpHeart);
            gamescene.powerUPList.push({ id: value.id, x: value.x, y: value.y, type: 'HP', sprite: powerUpHeart });
            break;

          case 'SHIELD':
            const powerUpShield = gamescene.physics.add.sprite(value.x, value.y, 'powerUpShield');
            powerUpShield.setData('id', value.id);
            powerUpShield.setData('type', value.type);
            powerUpShield.body.immovable = true;
            gamescene.powerups.add(powerUpShield);
            gamescene.powerUPList.push({ id: value.id, x: value.x, y: value.y, type: 'SHIELD', sprite: powerUpShield });
            break;

          case 'SHOOTING':
            const powerUpShooting = gamescene.physics.add.sprite(value.x, value.y, 'powerUpShooting');
            powerUpShooting.setData('id', value.id);
            powerUpShooting.setData('type', value.type);
            powerUpShooting.body.immovable = true;
            gamescene.powerups.add(powerUpShooting);
            gamescene.powerUPList.push({
              id: value.id,
              x: value.x,
              y: value.y,
              type: 'SHOOTING',
              sprite: powerUpShooting,
            });
            break;

          case 'ENERGY':
            const powerUpEnergy = gamescene.physics.add.sprite(value.x, value.y, 'powerUpEnergy');
            powerUpEnergy.setData('id', value.id);
            powerUpEnergy.setData('type', value.type);
            powerUpEnergy.body.immovable = true;
            gamescene.powerups.add(powerUpEnergy);
            gamescene.powerUPList.push({
              id: value.id,
              x: value.x,
              y: value.y,
              type: 'ENERGY',
              sprite: powerUpEnergy,
            });
            break;

          default:
            gamescene.add.text(gamescene.shipPlayer.x, gamescene.shipPlayer.x, 'default');
            break;
        }
      }
    });
  });
};

export const startFasterShooting = (gamescene: GameScene) => {
  gamescene.endTimefasterShooting = gamescene.time.now + gamescene.fasterShootingTime;
  gamescene.fasterShootingOn = true;
  if (gamescene.playerSP < 50) gamescene.playerSP += 50;
  gamescene.playerShootPowerGameObject.setText(`SP: ${gamescene.playerSP.toString()} P`);
};

export const stopFasterShooting = (gamescene: GameScene) => {
  if (gamescene.time.now > gamescene.endTimefasterShooting) {
    gamescene.fasterShootingOn = false;
  }
};

export const startInvincible = (gamescene: GameScene) => {
  gamescene.endTimeinvincible = gamescene.time.now + gamescene.invincibleTime;
  gamescene.invincible = true;
};

export const stopInvincible = (gamescene: GameScene) => {
  if (gamescene.time.now > gamescene.endTimeinvincible) {
    gamescene.invincible = false;
  }
};

export const spawnRandomPowerUPbyChance = (posX: number, posY: number, gamescene: GameScene) => {
  const random = getRandomInt(1, 10);
  if (random > 6) {
    const position = { x: posX, y: posY };
    gamescene.gameRoom.then((room) => {
      room.send('spawnPowerUp', position);
    });
  }
};

export const shieldUpdate = (gamescene: GameScene) => {
  if (!gamescene.invincible) {
    gamescene.schieldGameObject.setVisible(false);
  } else {
    gamescene.schieldGameObject.setVisible(true);
  }
};
