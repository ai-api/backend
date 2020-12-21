import { celebrate, Joi, Segments, errors } from 'celebrate';
import {Client} from 'pg';
import fs from 'fs';
import express from 'express';
import config from './config/config';
import bodyParser from 'body-parser';

import authRouter from './routes/authRoute';
import usersRouter from './routes/usersRoute';
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
   user: 'admin',
   host: 'db',
   database: 'db',
   password: 'c0cac0la',
   port: 3211
});
/* Connect to postgres client */
client.connect();


/////////////////////////////////////////////
////////////// EXPRESS CONFIG ///////////////
/////////////////////////////////////////////

app.listen(config.port, () => {
   console.log('AI API listening on port ' + config.port);
});




