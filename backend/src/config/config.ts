import * as dotenv from 'dotenv';

/* Read the .env from the root directory of the git */
dotenv.config({ path: __dirname + '/../../../.env' });

interface Config {
   port: string,
   db: {
      name: string,
      ip: string,
      username: string,
      password: string,
      port: string
   },
   ts: {
      ip: string,
      port: string
   }
};
const dev: Config = {
   'port': process.env.BACKEND_PORT_EXTERNAL || 'config error',
   'db': {
      'name': process.env.DB_NAME || 'config error',
      'username': process.env.DB_USERNAME || 'config error',
      'password': process.env.DB_PASSWORD || 'config error',
      'ip': 'localhost',
      'port': process.env.DB_PORT_EXTERNAL || 'config error'
   },
   'ts': {
      'ip': 'localhost',
      'port': process.env.TS_PORT_EXTERNAL || 'config error',
   }
};
const prod: Config = {
   'port':  process.env.BACKEND_PORT_INTERNAL || 'config error',
   'db': {
      'name': process.env.DB_NAME || 'config error',
      'username': process.env.DB_USERNAME || 'config error',
      'password': process.env.DB_PASSWORD || 'config error',
      'ip': 'db' || 'config error',
      'port': process.env.DB_PORT_INTERNAL || 'config error'
   },
   'ts': {
      'ip': 'ts',
      'port': process.env.TS_PORT_EXTERNAL || 'config error',
   }
};

/**
 * In package.json, I set the environment variable @NODE_ENV
 * to be 'prod' when 'yarn start' is called, and to be 'dev'
 * when 'yarn dev'
 */
export default process.env.NODE_ENV == 'prod' ? prod : dev;