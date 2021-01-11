import { Pool } from 'pg';
import config from '../config/config';

export default new Pool({
   user: config.db.username,
   host: config.db.ip,
   database: config.db.name,
   password: config.db.password,
   port: config.db.port
});

