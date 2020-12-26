interface Config {
   port: string,
   db: {
      name: string,
      ip: string,
      username: string,
      password: string,
      port: number
   },
   ts: {
      ip: string,
      port: number
   }
   auth: {
      alg: string,
      enc: string,
      iss: string,
      aud: string,
   }
}

const dev: Config = {
   'port': '8080',
   'db': {
      'name': 'aiapi',
      'username': 'admin',
      'password': 'c0cac0la',
      'ip': 'localhost',
      'port': 7979
   },
   'ts': {
      'ip': 'localhost',
      'port': 7777
   },
   'auth': {
      'alg': 'A256KW',
      'enc': 'A256GCM',
      'iss': 'aiapi.app',
      'aud': 'aiapi.app'
   }
};
const prod: Config = {
   'port': '80',
   'db': {
      'name': 'aiapi',
      'username': 'admin',
      'password': 'c0cac0la',
      'ip': 'localhost',
      'port': 5432
   },
   'ts': {
      'ip': 'ts',
      'port': 8501,
   },
   'auth': {
      'alg': 'A256KW',
      'enc': 'A256GCM',
      'iss': 'aiapi.app',
      'aud': 'aiapi.app'
   }
};

/**
 * In package.json, I set the environment variable @NODE_ENV
 * to be 'prod' when 'yarn start' is called, and to be 'dev'
 * when 'yarn dev'
 */
export default process.env.NODE_ENV == 'prod' ? prod : dev;