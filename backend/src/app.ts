/**
 * We can use import statements
 * now
 */
import express from 'express';
import config from './config/config';

const app = express();

console.log('Hello World from the console!');

app.get('/', (req,res) => {
   res.send('Hello World!');
});

app.listen()

