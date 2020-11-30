/**
 * We can use import statements
 * now
 */
import express from 'express';
import config from './config/config';

const app = express();

console.log(config.port);

app.get('/', (req,res) => {
   res.send('Hello World!');
});

app.listen(config.port, () => {
   console.log('AI API listening on port ' + config.port);
});

