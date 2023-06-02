import { GameScene } from '../game-scene';
import { BulletProps } from './bullet';

export const shoot = (playerX: number, playerY: number, rotation: number, owneruid: string, gamescene: GameScene) => {
  if (owneruid !== gamescene.uid) {
    const bullet = gamescene.physics.add.sprite(
      // startx,starty,
      0,
      0,
      'bullet',
    );

    bullet.depth = 0;
    bullet.setAngle(rotation + 90);

    bullet.body.reset(playerX, playerY);

    const angle = Phaser.Math.DegToRad(rotation - 90);

    // Same as with the Ship, lets the Bullet fly
    bullet.scene.physics.velocityFromRotation(angle, gamescene.bulletSpeed, bullet.body.velocity);

    bullet.body.velocity.x *= 2;
    bullet.body.velocity.y *= 2;
    bullet.setData('id', owneruid);

    // adding new bullet to bulletsGroup for working collision
    gamescene.otherbulletsGroup.add(bullet);
    gamescene.bullets.push({
      sprite: bullet,
      lifeTime: gamescene.time.now + gamescene.bulletLifeTime,
      owner: owneruid,
    });
  } else {
    if (gamescene.time.now > gamescene.nextFire) {
      if (gamescene.playerSP >= 50) {
        if (!gamescene.fasterShootingOn) {
          gamescene.playerSP -= 50;
          gamescene.playerShootPowerGameObject.setText(`SP: ${gamescene.playerSP.toString()} P`);
        }

        const bulletProp: BulletProps = {
          playerX: 0,
          playerY: 0,
          playerId: '0',
          active: true,
          rotation: 0,
        };

        gamescene.sound.play('shot');
        gamescene.nextFire = gamescene.time.now + gamescene.fireRate;
        const bullet = gamescene.physics.add.sprite(
          // startx,starty,
          0,
          0,
          'bullet',
        );

        bullet.depth = 0;

        bullet.setAngle(rotation + 90);

        bullet.body.reset(playerX, playerY);

        const angle = Phaser.Math.DegToRad(rotation - 90);

        // Same as with the Ship, lets the Bullet fly
        bullet.scene.physics.velocityFromRotation(angle, gamescene.bulletSpeed, bullet.body.velocity);

        bullet.body.velocity.x *= 2;
        bullet.body.velocity.y *= 2;
        // adding new bullet to bulletsGroup for working collision
        gamescene.bulletsGroup.add(bullet);
        gamescene.bullets.push({
          sprite: bullet,
          lifeTime: gamescene.time.now + gamescene.bulletLifeTime,
          owner: owneruid,
        });
        bulletProp.playerX = gamescene.shipPlayer.x;
        bulletProp.playerY = gamescene.shipPlayer.y;
        bulletProp.playerId = gamescene.uid;
        bulletProp.active = true;
        bulletProp.rotation = gamescene.shipPlayer.body.rotation;

        gamescene.gameRoom.then((room) => room.send('shoot', bulletProp));
      }
    }
  }
};
