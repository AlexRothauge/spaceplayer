require('dotenv-safe').config({ path: '../../infra/env_vars/.env', example: '../../infra/env_vars/.env.example' });

const prefix = (path) => {
  let prefix = null;
  switch (process.env.NODE_ENV) {
    // development uses tsc-watch now
    case 'test':
      prefix = 'src';
      break;
    case 'development':
    case 'production':
    default:
      prefix = 'dist/src';
      break;
  }

  return `${prefix}/${path}`;
};

const config = {
  type: 'mysql',
  host: process.env.DBHOST,
  port: Number(process.env.DBPORT),
  username: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBDATABASE,
  synchronize: false,
  logging: false,
  entities: [prefix('api/{entity,domain,projection}/**/*.*')],
  migrations: [prefix('api/migration/**/*.*')],
  subscribers: [prefix('api/{subscriber,domain,projection}/**/*.*')],
  cli: {
    entitiesDir: prefix('api/{entity,domain,projection}'),
    migrationsDir: prefix('api/migration'),
    subscribersDir: prefix('api/{subscriber,domain,projection}'),
  },
};
module.exports = config;
