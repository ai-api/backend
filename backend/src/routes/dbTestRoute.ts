import express from 'express';
import Package from '../models/dataModels/package';
import User from '../models/dataModels/user';
import { Client, Pool } from 'pg';
import config from '../config/config';
import pool from '../db/pool';
const router = express.Router();


 

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
      const testPackage: Package = Package.createInstance(client, 1, 'name', 1, 'description', 'input', 'output', [], 'markdown');
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
      const id = 5;
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
      const id = 5;
      Package.getInstance(client, id)
         .then(testPackage =>{
            testPackage.category = 2;
            testPackage.description = 'new description';
            testPackage.input = 'new input';
            testPackage.output = 'new output';
            testPackage.markdown = 'new markdown';
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
      const id = 5;
      Package.getInstance(client, id)
         .then(testPackage =>{
            testPackage.delete()
               .then((result) =>{
                  // Release the client resource
                  client.release();
                  res.json(`Package ${id} Successfully Deleted with result ${result}`);
               });
         });
   });
});

/* Test Create Package */
router.get('/createUser',(req, res, next)=>{
   // Checkout a client from the pool
   pool.connect((err, client, done) =>{
      if(err){
         // Release the client and log the error
         client.release();
         console.log(err);
      } 
      // Create test package object
      const testUser: User = User.createInstance(client, 'username', 'password', 'email@email.com', 'APIKEY', 'someurl.com');
      console.log(testUser);
      // Insert package object into package table
      testUser.save()
         .then(id=>{
            // Release the client resource
            client.release();
            res.send(`Created a New User with ID=${id}`); 
         });
   });
});

/* Test Read Package */
router.get('/readUser',(req, res, next)=>{
   // Checkout a client from the pool
   pool.connect((err, client, done) =>{
      if(err){
         // Release the client and log the error
         client.release();
         console.log(err);
      } 
      // initialize a package object
      const id = 7;
      User.getInstance(client, id)
         .then(resultUser =>{
            client.release();
            res.json(JSON.stringify(resultUser));
         })
         .catch(err=>{
            client.release();
            res.json(err);
         });
   });
});

/* Test Update Package */
router.get('/updateUser',(req, res, next)=>{
   // Checkout a client from the pool
   pool.connect((err, client, done) =>{
      if(err){
         // Release the client and log the error
         client.release();
         console.log(err);
      } 
 
      // initialize a package object
      const id = 7;
      User.getInstance(client, id)
         .then(testUser =>{
            testUser.username = 'new username';
            testUser.password = 'new password';
            testUser.email = 'newemail@email.com';
            testUser.apiKey = 'NEWAPIKEY';
            testUser.profilePicture = 'newurl.com';
            testUser.save()
               .then(() =>{
                  // Release the client resource
                  client.release();
                  res.json(`User ${id} Updated Successfully`);
               });
         });
   });
});

/* Test Remove Package */
router.get('/deleteUser',(req, res, next)=>{
   // Checkout a client from the pool
   pool.connect((err, client, done) =>{
      if(err){
         // Release the client and log the error
         client.release();
         console.log(err);
      } 
      const id = 7;
      User.getInstance(client, id)
         .then(testUser =>{
            testUser.delete()
               .then(() =>{
                  // Release the client resource
                  client.release();
                  res.json(`User ${id} Successfully Deleted`);
               });
         });
   });
});

export default router;