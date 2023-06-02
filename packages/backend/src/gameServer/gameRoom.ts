import { Client, Room } from 'colyseus';
import { State } from './schemas/state';
import { Player } from './schemas/player';
import { Bullet } from './schemas/bullet';
import { Astroid } from './schemas/astroid';
import { Enemy } from './schemas/enemy';
import { Tween } from './schemas/tween';
import { PowerUP } from './schemas/powerup';
import { request, IncomingMessage } from 'http';
import * as Colyseus from 'colyseus.js';

// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config({ path: '../../infra/env_vars/.env', example: '../../infra/env_vars/.env.example' });

type optionProps = {
  maxClients: number;
  maxAstroids: number;
  maxEnemys: number;
  map: number;
};

function getRandomInt(min: number, max: number) {
  const minAdjusted = Math.ceil(min);
  const maxAdjusted = Math.floor(max);
  return Math.floor(Math.random() * (maxAdjusted - minAdjusted)) + min;
}

export class GameRoom extends Room<State> {
  // When room is initialized

  public nextAstroidID = 0;
  public nextEnemyID = 0;
  public nextPowerUPID = 0;

  // tslint:disable-next-line:variable-name
  onCreate(_options: optionProps) {
    this.autoDispose = false;

    const state = new State();
    state.maxClients = _options.maxClients;
    state.maxAstroids = _options.maxAstroids;
    state.maxEnemys = _options.maxEnemys;
    state.map = _options.map;
    state.emptyTimeStamp = Date.now();
    state.empty = false;

    this.setState(state);

    for (let index = 0; index < state.maxAstroids; index = index + 1) {
      const astroid = new Astroid();
      astroid.x = getRandomInt(-1900, 1900);
      astroid.y = getRandomInt(-1900, 1900);
      astroid.id = index;
      this.state.astroids.set(`${index}`, astroid);
      this.nextAstroidID = this.nextAstroidID + 1;
    }

    for (let index = 0; index < state.maxEnemys; index = index + 1) {
      const enemy = new Enemy();
      // defines the amount of pixels a enemy can move up down left and right
      // it has a 200*200 pixel field to move like this
      const enemyRangeOfMotion = 100;
      const movementPoints = 8;

      // holds all the x and y Coordinates for the path the jelly is meant to take
      const xCoordinates: number[] = [];
      const yCoordinates: number[] = [];

      // generate random waypoints
      for (let i = 0; i < movementPoints; i = i + 1) {
        xCoordinates.push(getRandomInt(0, enemyRangeOfMotion * 2));
        yCoordinates.push(getRandomInt(0, enemyRangeOfMotion * 2));
      }

      enemy.x = getRandomInt(-1900, 1900);
      enemy.y = getRandomInt(-1900, 1900);

      const tweenArray: {
        x: number;
        y: number;
        ease: string;
        duration: number;
      }[] = [
        {
          x: enemy.x,
          y: enemy.y,
          ease: 'Sine.easeInOut',
          duration: 0,
        },
      ];

      // push the remaining waypoints with the random coordinates
      for (let i = 0; i < xCoordinates.length; i = i + 1) {
        tweenArray.push({
          x: enemy.x + (xCoordinates[i] - enemyRangeOfMotion),
          y: enemy.y + (yCoordinates[i] - enemyRangeOfMotion),
          ease: 'Sine.easeInOut',
          duration: 500,
        });
      }

      // so the jelly does not snap to the starting position we add it as the last waypoint
      tweenArray.push({
        x: enemy.x,
        y: enemy.y,
        ease: 'Sine.easeInOut',
        duration: 500,
      });

      for (let tweenindex = 0; tweenindex < tweenArray.length; tweenindex = tweenindex + 1) {
        const tempTween = new Tween();
        tempTween.x = tweenArray[tweenindex].x;
        tempTween.y = tweenArray[tweenindex].y;
        tempTween.ease = tweenArray[tweenindex].ease;
        tempTween.duration = tweenArray[tweenindex].duration;
        enemy.tweenMap.set(`${tweenindex}`, tempTween);
      }
      enemy.id = index;
      this.state.enemys.set(`${index}`, enemy);
      this.nextEnemyID = this.nextEnemyID + 1;
    }
    console.log(this.state.enemys.size);

    this.onMessage('test', (client, message) => {
      console.log(client.sessionId, ' send test with message: ', message, 'test');
    });

    this.onMessage('getPlayers', (_CLIENT, _MESSAGE) => {
      let playercount = 0;
      this.state.players.forEach((value, _KEY) => {
        if (value.uid !== ' ') {
          playercount = playercount + 1;
        }
      });
      this.broadcast('roomPlayers', playercount);
    });

    this.onMessage('move', (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x = data.x;
      player.y = data.y;
      player.rotation = data.rotation;
      player.uid = data.uid;
      player.name = data.name;
      player.invincible = data.invincible;
    });

    // tslint:disable-next-line:variable-name
    this.onMessage('shoot', (_client, data) => {
      const singleBullet: Bullet = new Bullet();

      singleBullet.playerX = data.playerX;
      singleBullet.playerY = data.playerY;
      singleBullet.playerId = data.playerId;
      singleBullet.rotation = data.rotation;

      this.state.bullets = singleBullet;
    });

    // tslint:disable-next-line:variable-name
    this.onMessage('destroyAstroid', (_client, data) => {
      this.broadcast('astroidDestroyed', data);
      const deleted = this.state.astroids.delete(`${data}`);

      if (deleted) {
        const astroid = new Astroid();
        astroid.x = getRandomInt(-1900, 1900);
        astroid.y = getRandomInt(-1900, 1900);
        astroid.id = this.nextAstroidID;

        this.state.astroids.set(`${this.nextAstroidID}`, astroid);
        this.nextAstroidID = this.nextAstroidID + 1;
      }
    });

    // tslint:disable-next-line:variable-name
    this.onMessage('destroyShip', (_client, data) => {
      this.broadcast('shipDestroyed', data);
    });

    // tslint:disable-next-line:variable-name
    this.onMessage('destroyEnemy', (_client, data) => {
      this.broadcast('enemyDestroyed', data);
      const deleted = this.state.enemys.delete(`${data}`);

      if (deleted) {
        const enemy = new Enemy();
        enemy.x = getRandomInt(-1900, 1900);
        enemy.y = getRandomInt(-1900, 1900);
        enemy.id = this.nextEnemyID;
        const tweenArray: {
          x: number;
          y: number;
          ease: string;
          duration: number;
        }[] = [
          {
            x: enemy.x,
            y: enemy.y,
            ease: 'Sine.easeInOut',
            duration: 0,
          },
        ];
        const enemyRangeOfMotion = 100;
        const movementPoints = 8;

        // holds all the x and y Coordinates for the path the jelly is meant to take
        const xCoordinates: number[] = [];
        const yCoordinates: number[] = [];

        // generate random waypoints
        for (let i = 0; i < movementPoints; i = i + 1) {
          xCoordinates.push(getRandomInt(0, enemyRangeOfMotion * 2));
          yCoordinates.push(getRandomInt(0, enemyRangeOfMotion * 2));
        }

        // push the remaining waypoints with the random coordinates
        for (let i = 0; i < xCoordinates.length; i = i + 1) {
          tweenArray.push({
            x: enemy.x + (xCoordinates[i] - enemyRangeOfMotion),
            y: enemy.y + (yCoordinates[i] - enemyRangeOfMotion),
            ease: 'Sine.easeInOut',
            duration: 500,
          });
        }

        // so the jelly does not snap to the starting position we add it as the last waypoint
        tweenArray.push({
          x: enemy.x,
          y: enemy.y,
          ease: 'Sine.easeInOut',
          duration: 500,
        });

        for (let index = 0; index < tweenArray.length; index = index + 1) {
          const tempTween = new Tween();
          tempTween.x = tweenArray[index].x;
          tempTween.y = tweenArray[index].y;
          tempTween.ease = tweenArray[index].ease;
          tempTween.duration = tweenArray[index].duration;
          enemy.tweenMap.set(`${index}`, tempTween);
        }
        this.state.enemys.set(`${this.nextEnemyID}`, enemy);
        this.nextEnemyID = this.nextEnemyID + 1;
      }
    });
    this.onMessage('spawnPowerUp', (client, message) => {
      console.log(client.sessionId, ' send spawnPowerUp with message: ', message);
      const powerup = new PowerUP();
      powerup.x = message.x;
      powerup.y = message.y;
      powerup.id = this.nextPowerUPID;
      switch (getRandomInt(1, 5)) {
        case 1:
          powerup.type = 'HP';
          break;

        case 2:
          powerup.type = 'SHIELD';
          break;

        case 3:
          powerup.type = 'SHOOTING';
          break;

        case 4:
          powerup.type = 'ENERGY';
          break;

        default:
          console.log('default');
          break;
      }
      this.state.powerups.set(`${this.nextPowerUPID}`, powerup);
      this.nextPowerUPID = this.nextPowerUPID + 1;
    });

    // message to update The Score of a Player
    this.onMessage('updateScore', (client, message: string) => {
      this.state.players.get(client.sessionId).score += parseInt(message, 10);
    });

    // message to send current score to backend
    this.onMessage('setHighScore', (client, token: string) => {
      const player: Player = this.state.players.get(client.sessionId);
      const params = {
        key: process.env.SECRET_KEY_512,
        userName: player.name,
        highScore: (player.score as unknown) as string,
      };

      const options = {
        hostname: `${process.env.BACKEND_HOST}`,
        port: 4000,
        path: '/api/user/',
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      };
      const req = request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', (d: string) => {
          console.log(`res data: ${d}`);
          client.send('updatedHS');
        });
      });

      req.on('error', (error: string) => {
        client.send('updatedHS');
        console.error(error);
      });

      req.write(JSON.stringify(params));
      req.end();
    });

    this.onMessage('pickUpPowerUp', (client, message) => {
      console.log(client.sessionId, ' send pickUpPowerUp with message: ', message);
      this.broadcast('PowerUpPickedUP', message);
      this.state.powerups.delete(`${message}`);
    });

    this.onMessage('getMap', (_CLIENT, _MESSAGE) => {
      console.log(this.state.map);
      this.broadcast('gameMap', this.state.map);
    });

    this.setSimulationInterval(() => this.update(), 1000);
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  // onAuth (client: Client, options: any, request: http.IncomingMessage) { }

  // When client successfully join the room
  // tslint:disable-next-line:variable-name
  onJoin(_client: Client, _options: any, _auth: any) {
    this.state.players.set(_client.sessionId, new Player());
    if (_client.auth !== 'myRoom') {
      console.log(` \n \n --------------- \n\n`);
      this.state.empty = false;
    }
  }

  // When a client leaves the room
  // tslint:disable-next-line:variable-name
  onLeave(_client: Client, _consented: boolean) {
    const clientUid = this.state.players.get(_client.sessionId).uid;
    // Boradcast a message to all Clients if a player leaves
    this.broadcast('playerLeft', clientUid);
    this.state.players.delete(_client.sessionId);
    // only if players size is 0 AND the room was not already empty
    // (The room to check what rooms are open(myRoom) leaves too but does not count as player)
    if (this.state.players.size === 0 && !this.state.empty) {
      this.state.emptyTimeStamp = Date.now();
      this.state.empty = true;
    }
  }

  // tslint:disable-next-line:variable-name
  onAuth(_client: Client, options: any, _req: IncomingMessage): any {
    // every client goes through auth before connecting
    // options.type is only send from myRoom so we can identify it later
    // we need this to calculate correctly if the room is empty
    if (options.type !== undefined) {
      return options.type;
    }
    // all other clients can join normally
    return true;
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {
    // send a Message to myRoom so the room does not show up in the list of all rooms again
    const myRoomClient = new Colyseus.Client(`ws://${process.env.BACKEND_HOST}:5000`);
    myRoomClient.join('my_room').then((mRoom) => {
      mRoom.send('disposedRoom', this.roomId);
    });
    console.log('Dispose GameRoom');
  }

  update() {
    // 300 = 5min
    const timeoutTimeS: number = 300;
    // if the room is empty for given amount of time the room closes itself
    if (this.state.empty && Date.now() - this.state.emptyTimeStamp > timeoutTimeS * 1000) {
      this.disconnect().then((r) => console.log(`closed Room ${r}`));
    }
  }
}
