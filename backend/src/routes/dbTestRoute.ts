import express from 'express';
import Package from '../db/data_models/package';
import { Client, Pool } from 'pg';
import config from '../config/config';

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

/* Show all entries of a particular table */
router.get('/listTable', (req, res)=>{
   
   pool.connect((err, client, done) =>{
      if(err){
         // Release the client and log the error
         client.release();
         console.log(err);
      }
      const tableName = 'package';
      const queryText = `SELECT * FROM ${tableName}`; 
      client.query(queryText)
         .then(queryResult=>{
            // Release the client resource
            client.release();
            res.json(JSON.stringify(queryResult.rows));
         });
   });
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
      const testPackage: Package = Package.createInstance(client, 1, 'name', 1, 'description', 'input', 'output', 'markdown');
      console.log(testPackage);
      // Insert package object into package table
      testPackage.save()
         .then(id=>{
            // Release the client resource
            client.release();
            res.send(`Created a New Package with ID=${id}`); 
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
      Package.getInstance(client, id)
         .then(resultPackage =>{
            client.release();
            res.json(JSON.stringify(resultPackage));
         })
         .catch(err=>{
            client.release();
            res.json(err);
         });
   });
});

/* Test Update Package */
router.get('/updatePackage',(req, res, next)=>{
   // Checkout a client from the pool
   pool.connect((err, client, done) =>{
      if(err){
         // Release the client and log the error
         client.release();
         console.log(err);
      } 
 
      // initialize a package object
      const id = 14;
      Package.getInstance(client, id)
         .then(testPackage =>{
            testPackage.categoryId = 2;
            testPackage.description = 'new description';
            testPackage.input = 'new input';
            testPackage.output = 'new output';
            testPackage.md = 'new markdown';
            testPackage.name = 'new name';
            testPackage.userId = 99;
            testPackage.save()
               .then(() =>{
                  // Release the client resource
                  client.release();
                  res.json(`Package ${id} Updated Successfully`);
               });
         });
   });
});

/* Test Remove Package */
router.get('/deletePackage',(req, res, next)=>{
   // Checkout a client from the pool
   pool.connect((err, client, done) =>{
      if(err){
         // Release the client and log the error
         client.release();
         console.log(err);
      } 
      const id = 14;
      Package.getInstance(client, id)
         .then(testPackage =>{
            testPackage.delete()
               .then(() =>{
                  // Release the client resource
                  client.release();
                  res.json(`Package ${id} Successfully Deleted`);
               });
         });
   });
});

export default router;