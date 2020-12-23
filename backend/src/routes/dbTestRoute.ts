import express from 'express';
import Package from '../db/data_models/package'
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
    res.send('Database Testing Router')
})

/* Test Create Package */
router.get('/createPackage',(req, res, next)=>{
    // Checkout a client from the pool
    pool.connect((err, client, done) =>{
        if (err) throw err
        // Create test package object
        var testPackage: Package = new Package(1, 'name', 'category', 'description', 'inputs', 'ouputs', ['flag1','flag2']);
        console.log(testPackage);
        // Insert package object into package table
        testPackage.create(client);
        res.json('Creating a Package object and putting it in the database');
    });
})

export default router;