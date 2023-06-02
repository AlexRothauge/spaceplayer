import * as Colyseus from 'colyseus.js';
import { Bullet, destroyBullets } from './game-scene-components/bullet';
import {
  createCountOfPlayers,
  createPlayerShip,
  drawOtherPlayer,
  drawOtherPlayerBullets,
  otherPlayer,
  refillSP,
  sendMove,
} from './game-scene-components/players';
import { addAstroids, astroidProps } from './game-scene-components/astroid';
import { addEnemys, enemyProps } from './game-scene-components/enemy';
import { addPowerUPs, PowerUpProps, shieldUpdate, stopFasterShooting, stopInvincible } from './game-scene-components/powerup';
import { State } from './game-scene-components/state';
import { uuidv4 } from './game-scene-components/uuid4';
import { createScore } from './game-scene-components/score';
import { constructScene } from './game-scene-components/sceneConstructor';
import { createParticles } from './game-scene-components/particles';
import { createTexts } from './game-scene-components/uiTexts';
import { addKeys } from './game-scene-components/keys';
import {
  collisionAstroidEnemyBulletHandler,
  collisionBulletAsteroidHandler,
  collisionBulletEnemyHandler,
  collisionBulletShipHandler,
  collisionJellyEnemyBulletHandler,
  collisionMyShipEnemyBulletHandler,
  collisionShipAsteroidHandler,
  collisionShipEnemyHandler,
  collisionShipPowerUPHandler,
} from './game-scene-components/collisions';
import { youDied } from './game-scene-components/death';
import { playSound } from './game-scene-components/sound';
import { shoot } from './game-scene-components/shoot';
import { createFog } from './game-scene-components/fog';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  public uid = uuidv4();
  public client = new Colyseus.Client(`ws://${process.env.BACKEND_HOST}:5000`);
  public playerList: otherPlayer[] = [];
  public astroidList: astroidProps[] = [];
  public enemyList: enemyProps[] = [];
  public powerUPList: PowerUpProps[] = [];
  public gameRoom!: Promise<Colyseus.Room<State>>;
  public userName!: string;
  public userNameGameObject!: Phaser.GameObjects.Text;
  public userNameOtherPlayer: Phaser.GameObjects.Text[] = [];
  public playerHP!: number;
  public playerHpGameObject!: Phaser.GameObjects.Text;
  public playerSP!: number;
  public playerShootPowerGameObject!: Phaser.GameObjects.Text;
  // count of active players in the game
  public countOfPlayers = 1;
  // move speed of ship
  public speed = 750;
  // time between shots
  public fireRate = 200;
  // time var
  public nextFire = 0;
  // flight time of bullet
  public bulletLifeTime = 500;
  // bullet speed
  public bulletSpeed = this.speed * 2;
  // world size
  public worldSize = 4000;
  // x:  -2000 -> 2000
  // y: -2000 -> 2000

  // game map
  public map = 1;

  public invincibleTime = 5000;
  public invincible = true;
  public endTimeinvincible = 10000;

  public fasterShootingTime = 3000;
  public endTimefasterShooting = 0;
  public fasterShootingOn: boolean = false;

  public shootPowerRefillTime = 500;
  public endTimeShootPowerRefill = 0;

  public cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;

  // space key for shooting
  public space!: Phaser.Input.Keyboard.Key;

  // W-A-S-D keys for additional ship controlling
  public w!: Phaser.Input.Keyboard.Key;
  public a!: Phaser.Input.Keyboard.Key;
  public s!: Phaser.Input.Keyboard.Key;
  public d!: Phaser.Input.Keyboard.Key;

  public score!: number;
  public highScore!: number;
  public scoreGameObject!: Phaser.GameObjects.Text;
  public highScoreGameObject!: Phaser.GameObjects.Text;
  public countOfPlayersGameObject!: Phaser.GameObjects.Text;
  // this is the players ship
  public shipPlayer!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public schieldGameObject!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  // for collision we add it to a group
  public myship!: Phaser.GameObjects.Group;
  // for collision we add it to a group
  public otherships!: Phaser.GameObjects.Group;
  // for collision we add a asteroids group
  public asteroids!: Phaser.GameObjects.Group;

  // for more collisions we add a group for the enemies
  public enemies!: Phaser.GameObjects.Group;
  // for collision we add a bullets group
  public bulletsGroup!: Phaser.GameObjects.Group;

  // for collision we add a bullets group
  public otherbulletsGroup!: Phaser.GameObjects.Group;

  // because we want to remeber a lifetime for a bullet we create a Bullet array
  public bullets: Bullet[] = [];

  public powerups!: Phaser.GameObjects.Group;

  // Ship Boost Particles
  public particles!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  public emitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super(sceneConfig);

    constructScene(this);
  }

  // CREATE --------------------------------------------------------------------------------------- CREATE

  public create(): void {
    // creating a Phaser World (square)
    this.physics.world.setBounds(-2000, -2000, this.worldSize, this.worldSize);

    const background = 'background'.concat(this.map.toString());

    // add background
    this.add.tileSprite(0, 0, this.worldSize, this.worldSize, background);

    playSound('backgroundSound', this, {
      volume: 0.5,
      loop: true,
    });

    // init ships Group
    this.myship = this.add.group();
    createPlayerShip(this);

    this.otherships = this.add.group();

    createCountOfPlayers(this);

    createScore(this);

    // paricles
    createParticles(this);

    createTexts(this);

    addKeys(this);

    // init asteroids Group
    this.asteroids = this.add.group();

    // fill world with  COUNT_OF_ASTEROIDS asteroids
    addAstroids(this);

    // init enemies Group
    this.enemies = this.add.group();

    // Fill world with enemies
    addEnemys(this);

    // init bullets Group (collision and sprite/lifetime)
    this.bulletsGroup = this.add.group();
    this.otherbulletsGroup = this.add.group();

    this.powerups = this.add.group();

    createFog(this);

    sendMove(this);
  }

  // UPDATE --------------------------------------------------------------------------------------- UPDATE

  public update(): void {
    // Rotation of Ship
    if (this.cursorKeys.left.isDown || this.a.isDown) {
      this.shipPlayer.setAngularVelocity(-150);
    } else if (this.cursorKeys.right.isDown || this.d.isDown) {
      this.shipPlayer.setAngularVelocity(150);
    } else {
      this.shipPlayer.setAngularVelocity(0);
    }
    if (this.cursorKeys.up.isDown || this.w.isDown) {
      const rotationRad = Phaser.Math.DegToRad(this.shipPlayer.body.rotation - 90);

      // calculates with the given speed and rotation the velocity and applies it to the Ship
      this.physics.velocityFromRotation(rotationRad, 600, this.shipPlayer.body.acceleration);
    } else {
      this.shipPlayer.setAcceleration(0);
    }

    if (this.space.isDown) {
      shoot(this.shipPlayer.x, this.shipPlayer.y, this.shipPlayer.body.rotation, this.uid, this);
    }

    shieldUpdate(this);

    // tslint:disable-next-line:prefer-template
    this.scoreGameObject.setText((('Score: ' + this.score) as unknown) as string);
    // tslint:disable-next-line:prefer-template
    this.countOfPlayersGameObject.setText((('Players: ' + this.countOfPlayers) as unknown) as string);
    sendMove(this);

    // checks collision of shipGroup and asteroidsGroup, if so collisionShipAsteroid runs
    this.physics.overlap(
      this.myship,
      this.asteroids,
      (ship: Phaser.Types.Physics.Arcade.GameObjectWithBody, asteroid: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        collisionShipAsteroidHandler(ship, asteroid, this);
      },
      () => {
        return;
      },
      this,
    );
    // checks collision of shipGroup and enemyGroup, if so collisionShipEnemy runs
    this.physics.overlap(
      this.myship,
      this.enemies,
      (ship: Phaser.Types.Physics.Arcade.GameObjectWithBody, enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        collisionShipEnemyHandler(ship, enemy, this);
      },
      () => {
        return;
      },
      this,
    );

    // checks collision of bulletsGroup and asteroidsGroup, if so collisionBulletAsteroid runs
    this.physics.overlap(
      this.bulletsGroup,
      this.asteroids,
      (bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody, asteroid: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        collisionBulletAsteroidHandler(bullet, asteroid, this);
      },
      () => {
        return;
      },
      this,
    );
    // checks collision of bulletsGroup and enemyGroup, if so collisionBulletEnemy runs
    this.physics.overlap(
      this.bulletsGroup,
      this.enemies,
      (bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody, enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        collisionBulletEnemyHandler(bullet, enemy, this);
      },
      () => {
        return;
      },
      this,
    );

    // checks collision of other ships and your bullets, if so collisionBulletShip runs
    this.physics.overlap(
      this.otherships,
      this.bulletsGroup,
      (ship: Phaser.Types.Physics.Arcade.GameObjectWithBody, bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        collisionBulletShipHandler(ship, bullet, this);
      },
      () => {
        return;
      },
      this,
    );

    // checks collision of your ship and enemy bullets, if so collisionBulletShip runs
    this.physics.overlap(
      this.myship,
      this.otherbulletsGroup,
      (ship: Phaser.Types.Physics.Arcade.GameObjectWithBody, bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        collisionMyShipEnemyBulletHandler(ship, bullet, this);
      },
      () => {
        return;
      },
      this,
    );

    this.physics.overlap(
      this.asteroids,
      this.otherbulletsGroup,
      (asteroid: Phaser.Types.Physics.Arcade.GameObjectWithBody, bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        collisionAstroidEnemyBulletHandler(asteroid, bullet, this);
      },
      () => {
        return;
      },
      this,
    );
    this.physics.overlap(
      this.enemies,
      this.otherbulletsGroup,
      (enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody, bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        collisionJellyEnemyBulletHandler(enemy, bullet, this);
      },
      () => {
        return;
      },
      this,
    );

    this.physics.overlap(
      this.myship,
      this.powerups,
      (ship: Phaser.Types.Physics.Arcade.GameObjectWithBody, powerUp: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
        collisionShipPowerUPHandler(ship, powerUp, this);
      },
      () => {
        return;
      },
      this,
    );

    this.physics.collide(this.myship, this.otherships, () => {
      sendMove(this);
    });

    // checks bullet lifetime and destroys them if necessary
    drawOtherPlayerBullets(this);
    destroyBullets(this);

    drawOtherPlayer(this);
    addAstroids(this);
    addEnemys(this);

    addPowerUPs(this);
    stopFasterShooting(this);
    stopInvincible(this);

    refillSP(this);

    if (this.playerHP <= 0) {
      youDied(this);
    }
  }
}
