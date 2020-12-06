import { celebrate, Joi, Segments, errors } from 'celebrate';
import express from 'express';
import config from './config/config';
import bodyParser from 'body-parser';

import authRouter from './routes/auth';
import usersRouter from './routes/users';
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
////////////// EXPRESS CONFIG ///////////////
/////////////////////////////////////////////

app.listen(config.port, () => {
   console.log('AI API listening on port ' + config.port);
});




