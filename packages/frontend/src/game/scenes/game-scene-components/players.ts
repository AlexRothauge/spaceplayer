import { GameScene } from '../game-scene';
import { getRandomInt } from './getRandomInt';
import { shoot } from './shoot';

export type PlayerProps = {
  x: number;
  y: number;
  rotation: number;
  uid: string;
  score: number;
  hp: number;
  name: string;
  invincible: boolean;
};

export type otherPlayer = {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  shieldsprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  properties: PlayerProps;
};

export interface ValueType {
  userName: string;
  highScore: string;
}

export const createCountOfPlayers = (gamescene: GameScene) => {
  gamescene.countOfPlayersGameObject = gamescene.add
    .text(
      30,
      50,
      // tslint:disable-next-line:prefer-template
      (`Players: ${gamescene.countOfPlayers}` as unknown) as string,
    )
    .setScrollFactor(0);
};

export const createPlayerShip = (gamescene: GameScene) => {
  gamescene.shipPlayer = gamescene.physics.add.sprite(getRandomInt(-2000, 2000), getRandomInt(-2000, 2000), 'ship');
  gamescene.shipPlayer.body.setCollideWorldBounds(true);
  gamescene.schieldGameObject = gamescene.physics.add
    .sprite(gamescene.cameras.main.worldView.x + 640, gamescene.cameras.main.worldView.y + 480, 'shield')
    .setScrollFactor(0);
  gamescene.schieldGameObject.depth = 101;
  gamescene.shipPlayer.depth = 100;
  gamescene.myship.add(gamescene.shipPlayer);

  gamescene.shipPlayer.setBounce(1, 1);

  // this is a form of deceleration and will return the velocity of the ship back to 0
  // Drag is applied only when acceleration is zero
  // the higher the value, the faster the deceleration
  gamescene.shipPlayer.setDrag(300);

  gamescene.shipPlayer.setAngularDrag(400);

  // Limits the max Velocity to 600
  gamescene.shipPlayer.setMaxVelocity(600);

  // camera follow player
  gamescene.cameras.main.startFollow(gamescene.shipPlayer);
};

export const sendMove = (gamescene: GameScene) => {
  const currentProp: PlayerProps = {
    x: gamescene.shipPlayer.x,
    y: gamescene.shipPlayer.y,
    rotation: gamescene.shipPlayer.rotation,
    uid: gamescene.uid,
    score: gamescene.score,
    hp: gamescene.playerHP,
    name: gamescene.userName,
    invincible: gamescene.invincible,
  };
  gamescene.gameRoom.then((room) => {
    room.send('move', currentProp);
  });
};

export const checkPlayerExisting = (uid: string, gamescene: GameScene) => {
  for (let index = 0; index < gamescene.playerList.length; index++) {
    if (uid === gamescene.playerList[index].properties.uid) {
      return index;
    }
  }
  return -1;
};

export const drawOtherPlayer = (gamescene: GameScene) => {
  gamescene.gameRoom.then((room) => {
    gamescene.countOfPlayers = room.state.players.size;
    room.state.players.forEach((value) => {
      let tempUserName: Phaser.GameObjects.Text;

      // tslint:disable-next-line:no-empty
      if (value.uid === gamescene.uid || value.uid === ' ') {
      } else {
        const index = checkPlayerExisting(value.uid, gamescene);
        // if new Player
        if (index === -1) {
          const sprite = gamescene.physics.add.sprite(value.x, value.y, 'ship');
          sprite.setRotation(value.rotation + 1.5708);

          const shieldSprite = gamescene.physics.add.sprite(value.x, value.y, 'shield');
          if (value.invincible) {
            shieldSprite.setVisible(true);
          } else {
            shieldSprite.setVisible(false);
          }
          const currentProp: PlayerProps = {
            x: value.x,
            y: value.y,
            rotation: value.rotation,
            uid: value.uid,
            score: gamescene.score,
            hp: gamescene.playerHP,
            name: value.name,
            invincible: value.invincible,
          };
          gamescene.playerList.push({ sprite, shieldsprite: shieldSprite, properties: currentProp });

          gamescene.otherships.add(sprite);

          tempUserName = gamescene.add.text(value.x - 20, value.y - 80, value.name);

          gamescene.userNameOtherPlayer.push(tempUserName);
        }

        // if old Player
        else {
          gamescene.playerList[index].sprite.setX(value.x);
          gamescene.playerList[index].sprite.setY(value.y);
          gamescene.playerList[index].sprite.setRotation(value.rotation);
          // shield
          gamescene.playerList[index].shieldsprite.setX(value.x);
          gamescene.playerList[index].shieldsprite.setY(value.y);
          if (value.invincible) {
            gamescene.playerList[index].shieldsprite.setVisible(true);
          } else {
            gamescene.playerList[index].shieldsprite.setVisible(false);
          }

          // Render name of User
          gamescene.userNameOtherPlayer[index].setX(value.x - 20);
          gamescene.userNameOtherPlayer[index].setY(value.y - 80);
        }
      }
    });
  });
};

export const drawOtherPlayerBullets = (gamescene: GameScene) => {
  gamescene.gameRoom.then((room) => {
    room.state.bullets.forEach((singleBullet) => {
      if (!singleBullet.active || singleBullet.playerId === gamescene.uid) {
        return;
      }

      shoot(singleBullet.playerX, singleBullet.playerY, singleBullet.rotation, singleBullet.playerId, gamescene);
      singleBullet.active = false;
    });
  });
};

export const refillSP = (gamescene: GameScene) => {
  if (gamescene.time.now > gamescene.endTimeShootPowerRefill) {
    gamescene.endTimeShootPowerRefill = gamescene.time.now + gamescene.shootPowerRefillTime;
    if (gamescene.playerSP < 200) gamescene.playerSP += 10;
    gamescene.playerShootPowerGameObject.setText(`SP: ${gamescene.playerSP.toString()} P`);
  }
};
