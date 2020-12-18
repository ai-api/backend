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
   'port': '8080',
   'db': {
      'name': 'aiapi',
      'username': 'admin',
      'password': 'c0cac0la',
      'ip': 'localhost',
      'port': '7979'
   },
   'ts': {
      'ip': 'localhost',
      'port': '7777'
   }
};
const prod: Config = {
   'port': '80',
   'db': {
      'name': 'aiapi',
      'username': 'admin',
      'password': 'c0cac0la',
      'ip': 'localhost',
      'port': '5432'
   },
   'ts': {
      'ip': 'ts',
      'port': '8501',
   }
};

/**
 * In package.json, I set the environment variable @NODE_ENV
 * to be 'prod' when 'yarn start' is called, and to be 'dev'
 * when 'yarn dev'
 */
export default process.env.NODE_ENV == 'prod' ? prod : dev;