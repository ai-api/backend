import express from 'express';
import Package from '../db/data_models/package';
import { Client, Pool } from 'pg';
import config from '../config/config';

import {readPackage} from '../db/dbOperations';

const router = express.Router();

/* Create a postgres pool*/
const pool = new Pool({
   user: config.db.username,
   host: config.db.ip,
   database: config.db.name,
   password: config.db.password,
   port: config.db.port
});
 

router.get('/',(req, res, next)=>{
   res.send('Database Testing Router');
});

/* Test Create Package */
router.get('/createPackage',(req, res, next)=>{
   // Checkout a client from the pool
   pool.connect((err, client, done) =>{
      if(err){
         // Release the client and log the error
         client.release();
         console.log(err);
      } 
      // Create test package object
      const testPackage: Package = new Package(1, 'name', 'category', 'description', 'inputs', 'ouputs', ['flag1','flag2']);
      console.log(testPackage);
      // Insert package object into package table
      testPackage.create(client)
         .then(id=>{
            res.send(`Created a New Package with ID=${id}`);
            // Release the client resource
            client.release();
         });
   });
});

/* Test Read Package */
router.get('/readPackage',(req, res, next)=>{
   // Checkout a client from the pool
   pool.connect((err, client, done) =>{
      if(err){
         // Release the client and log the error
         client.release();
         console.log(err);
      } 
      // initialize a package object
      const id = 14;
      readPackage(client, id)
         .then(resultPackage =>{
            // Release the client resource
            client.release();
            res.json(JSON.stringify(resultPackage));
         });
      
   });
});

export default router;