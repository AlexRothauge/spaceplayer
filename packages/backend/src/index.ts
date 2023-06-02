import { globalRouter } from './api/router/global.router';
// tslint:disable-next-line: no-var-requires
require('dotenv-safe').config({ path: '../../infra/env_vars/.env', example: '../../infra/env_vars/.env.example' });

import { createDatabaseConnection } from './api/util/createDatabaseConnection';
import express from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import { authMiddleware } from './api/middleware/authentication';
import { Server } from 'colyseus';
import { createServer } from 'http';
import { GameRoom } from './gameServer/gameRoom';
import { MyRoom } from './gameServer/myRoom';
import cors from 'cors';
const port: number = Number(process.env.PORT);
const gamePort: number = 5000;

export const startServer = async () => {
  try {
    const app = express();
    const dbConnection = await createDatabaseConnection();

    app.use(bodyParser.json());
    const corsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
    // use morgan to log all requests
    app.use(morgan('combined'));
    app.use(authMiddleware);
    app.use('/api', globalRouter);

    const gameServer = new Server({
      server: createServer(app),
    });
    gameServer
      .define('game_room', GameRoom)
      .on('create', (room) => console.log('room created:', room.roomId))
      .on('dispose', (room) => console.log('room disposed:', room.roomId))
      .on('join', (room, client) => console.log(client.id, 'joined', room.roomId))
      .on('leave', (room, client) => console.log(client.id, 'left', room.roomId));

    gameServer
      .define('my_room', MyRoom)
      .on('My Room create', (room) => console.log('room created:', room.roomId))
      .on('dispose', (room) => console.log('room disposed:', room.roomId, 'my_room'))
      .on('join', (room, client) => console.log(client.id, 'joined', room.roomId, 'my_room'))
      .on('leave', (room, client) => console.log(client.id, 'left', room.roomId));

    const server = app.listen(port, () => {
      console.log(`Server is Running on Port ${port}`);
    });

    await gameServer.listen(gamePort, '', 0, () => {
      console.log(`gameServer on Port ${gamePort}`);
    });

    return { server, dbConnection };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// tslint:disable-next-line: no-floating-promises
startServer();
