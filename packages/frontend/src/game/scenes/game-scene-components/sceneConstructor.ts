import { GameScene } from '../game-scene';
import { checkAstroidInList } from './astroid';
import { checkEnemyInList } from './enemy';
import { checkPlayerExisting } from './players';
import { checkPowerUPInList } from './powerup';
import { playSound } from './sound';
import { playAnimation } from './animation';

export const constructScene = (gamescene: GameScene) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const gameRoomid = urlParams.get('g');
  gamescene.gameRoom = gamescene.client.joinById(`${gameRoomid}`);
  gamescene.score = 0.0;

  // set HighScore if its not guestmode
  `${localStorage.getItem('GuestCheck')}` !== 'true'
    ? (gamescene.highScore = parseInt(`${localStorage.getItem('highScore')}`, 10))
    : (gamescene.highScore = -1);

  gamescene.gameRoom.then((room) => {
    room.onMessage('astroidDestroyed', (message) => {
      const index = checkAstroidInList(parseInt(message, 10), gamescene);
      if (index > -1) {
        playSound(
          'asteroidExplosion',
          gamescene,
          undefined,
          gamescene.astroidList[index].sprite.x,
          gamescene.astroidList[index].sprite.y,
          gamescene.shipPlayer.x,
          gamescene.shipPlayer.y,
        );
        const x: number = gamescene.astroidList[index].sprite.x;
        const y: number = gamescene.astroidList[index].sprite.y;

        gamescene.asteroids.remove(gamescene.astroidList[index].sprite);
        gamescene.astroidList[index].sprite.destroy();

        playAnimation(x, y, 'astExplosion', gamescene, {
          key: 'asteroidExplosion',
          repeat: 0,
          frameRate: 20,
          frames: gamescene.anims.generateFrameNames('astExplosion', { start: 0, end: 8 }),
        });
      }
    });

    room.onMessage('shipDestroyed', (message) => {
      if (gamescene.uid === message) {
        gamescene.score += 100;
        room.send('updateScore', '100');
      }
    });

    room.onMessage('enemyDestroyed', (message) => {
      const index = checkEnemyInList(parseInt(message, 10), gamescene);
      if (index > -1) {
        playSound(
          'jellyfishDiedSound',
          gamescene,
          {
            rate: 1.3,
          },
          gamescene.enemyList[index].sprite.x,
          gamescene.enemyList[index].sprite.y,
          gamescene.shipPlayer.x,
          gamescene.shipPlayer.y,
        );
        const x: number = gamescene.enemyList[index].sprite.x;
        const y: number = gamescene.enemyList[index].sprite.y;

        gamescene.enemies.remove(gamescene.enemyList[index].sprite);
        gamescene.enemyList[index].sprite.destroy();

        playAnimation(x, y, 'jellyfishDied', gamescene, {
          key: 'enemyDied',
          repeat: 0,
          frameRate: 25,
          frames: gamescene.anims.generateFrameNames('jellyfishDied', { start: 0, end: 9 }),
        });
      }
    });

    room.onMessage('playerLeft', (message) => {
      const index = checkPlayerExisting(message, gamescene);

      const x: number = gamescene.playerList[index].sprite.x;
      const y: number = gamescene.playerList[index].sprite.y;

      if (index > -1) {
        playSound(
          'shipExplosion',
          gamescene,
          undefined,
          gamescene.playerList[index].sprite.x,
          gamescene.playerList[index].sprite.y,
          gamescene.shipPlayer.x,
          gamescene.shipPlayer.y,
        );
        playAnimation(x, y, 'shipExplosionAnimation', gamescene, {
          key: 'shipAnimation',
          repeat: 0,
          frameRate: 25,
          frames: gamescene.anims.generateFrameNames('shipExplosionAnimation', { start: 0, end: 16 }),
        });
        gamescene.userNameOtherPlayer[index].destroy();
        gamescene.playerList[index].sprite.destroy();
      }
    });

    room.onMessage('PowerUpPickedUP', (message) => {
      const index = checkPowerUPInList(message, gamescene);
      if (index > -1) {
        gamescene.powerUPList[index].sprite.destroy();
      }
    });

    // tslint:disable-next-line: no-shadowed-variable
    gamescene.gameRoom.then((room) => {
      room.send('getMap', '');
    });

    room.onMessage('gameMap', (message) => {
      gamescene.map = message;
    });
  });
  gamescene.userName = `${localStorage.getItem('userName')}`;
  gamescene.playerHP = 100;
  gamescene.playerSP = 100;
};
