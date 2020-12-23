import { errors } from 'celebrate';
import { Client } from 'pg';
import fs from 'fs';
import express from 'express';
import config from './config/config';
import bodyParser from 'body-parser';

import authRouter from './routes/authRoute';
import usersRouter from './routes/usersRoute';
import dbTestRouter from './routes/dbTestRoute';
/* Init express */
const app = express();
/////////////////////////////////////////////
//////////////// MIDDLEWARE /////////////////
/////////////////////////////////////////////

/* bodyParser is req'd to process json body */
app.use(bodyParser.json());

/* Handles all requests to /auth */
app.use('/auth', authRouter);
app.use('/users/', usersRouter);

/* Used to debug/test database operations */
app.use('/dbTest/', dbTestRouter);
/**
 * For some reason you need to add errors()
 * after you add all of the routes, otherwise
 * it doesn't work
 */
app.use(errors());
/////////////////////////////////////////////
/////////// INITIALIZE DATABASE /////////////
/////////////////////////////////////////////

/* Create and connect to postgres client*/
const client = new Client({
   user: config.db.username,
   host: config.db.ip,
   database: config.db.name,
   password: config.db.password,
   port: config.db.port
});
/* Connect to postgres client */
client.connect()
   .catch((err: Error) => {
      console.log('ERROR: Could not connect to database!');
      console.log(err);
   });

/* Run SQL script to initialize database tables */
var initDbSql = fs.readFileSync('src/db/loadTables.sql').toString();
client.query(initDbSql, function(err){
   if(err)
      console.log('ERROR: Could not successfully load tables', err);
});

/////////////////////////////////////////////
////////////// EXPRESS CONFIG ///////////////
/////////////////////////////////////////////

app.listen(config.port, () => {
   console.log('AI API listening on port ' + config.port);
});
/////////////////////////////////////////////
/////////////// TEMP/TESTING ////////////////
/////////////////////////////////////////////
