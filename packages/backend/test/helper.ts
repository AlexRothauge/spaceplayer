import express, { Express } from 'express';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import bodyParser from 'body-parser';
import { globalRouter } from '../src/api/router/global.router';
import { authMiddleware } from '../src/api/middleware/authentication';

// tslint:disable-next-line: no-var-requires
require('dotenv-safe').config({ path: '../../infra/env_vars/.env', example: '../../infra/env_vars/.env.example' });

export class Helper {
  public app: Express | null;
  private dbConnection: Connection;

  public async init() {
    jest.setTimeout(10000);
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(authMiddleware);

    this.app.use('/api', globalRouter);
    const config = await getConnectionOptions('default');

    this.dbConnection = await createConnection(
      // tslint:disable-next-line: prefer-object-spread
      Object.assign({}, config, { database: process.env.DBDATABASE }),
    );

    await this.resetDatabase();
  }

  public resetDatabase = async () => {
    await this.dbConnection.synchronize(true);
  };

  public async shutdown() {
    await this.resetDatabase();
    return this.dbConnection.close();
  }
}
