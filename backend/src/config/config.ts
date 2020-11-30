import * as dotenv from 'dotenv';

/* Read the .env from the root directory of the git */
dotenv.config({ path: __dirname + '/../../../.env' });

interface Config {
   port: string,
   db: {
      name: string,
      username: string,
      password: string,
      port: string
   }
}
const dev: Config = {
   'port': '8000',
   'db': {
      'name': process.env.DB_NAME || 'config error',
      'username': process.env.DB_USERNAME || 'config error',
      'password': process.env.DB_PASSWORD || 'config error',
      'port': process.env.DB_PORT_EXTERNAL || 'config error'
   }
};
const prod: Config = {
   'port': '80',
   'db': {
      'name': process.env.DB_NAME || 'config error',
      'username': process.env.DB_USERNAME || 'config error',
      'password': process.env.DB_PASSWORD || 'config error',
      'port': process.env.DB_PORT_INTERNAL || 'config error'
   }
};

/**
 * In package.json, I set the environment variable @NODE_ENV
 * to be 'prod' when 'yarn start' is called, and to be 'dev'
 * when 'yarn dev'
 */
export default process.env.NODE_ENV == 'prod' ? prod : dev;