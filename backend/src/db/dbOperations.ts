import { Client, PoolClient } from 'pg';
import TableNames from './enums/tableNames';
import Package from '../models/dataModels/package';

/**
 * SQL queries with parameters require a string which denotes
 * what index each value is located at in the values array
 * @param numParams The number of parameters in the SQL query
 * @return A string which denotes what index each value is 
 * located at in the values array
 */
function getIndicesString(numParams: number): string{
   const result: Array<string> = [];
   for(let i = 1; i <= numParams; i++)
      result.push(`$${i}`);
   return result.join();
}

/**
 * Generates a query string to update an entry of a given id at a given table
 * @param tableName The name of the table to construct the query for
 * @param columnNames The names of the columns to update
 * @param id The ID of the entry to be updated
 * @return A query string to update an entry
 */
function updateById(tableName: string, columnNames: Array<string>, id: number): string{

   // Setup static beginning of query
   const query = [`UPDATE ${tableName} SET`];
   // Create another array storing each set command
   const set = columnNames.map((column, index)=>{
      return `${column} = ($${index + 1})`;
   }); 
   query.push(set.join());
   // Add the WHERE statement to look up by id
   query.push(`WHERE id = ${id}`);
   // Return a complete query string
   return query.join(' ');
}

function generateSelectQuery(columnNames: Array<string>): string{
   const set = columnNames.map((column, index)=>{
      return `${column} = $${index + 1}`;
   });
   return set.join();
}

/**
 * Generate a query string to insert an entry into a given table
 * @param tableName The name of the table to construct the query for
 * @param columnNames The names of the columns to create
 * @return A query string to insert an entry
 */
function insertIntoTable(tableName: string, columnNames: Array<string>): string {
   const valueIndices: string = getIndicesString(columnNames.length);
   return `INSERT INTO ${tableName}(${columnNames.join()}) VALUES(${valueIndices}) RETURNING id`;
}

/**
 * Create a new entry in a given table with given values
 * @param client The pool client object
 * @param tableName The name of the table to insert into
 * @param columnNames The names of the columns to create
 * @param columnValues The values to create
 * @return A promise which resolves to a number. The entry ID
 * is returned on a successful create, 0 is returned if the postgres
 * client can't create the object, -1 is returned if an error occurs
 */
export async function dbCreate(client: PoolClient, tableName: string, columnNames: Array<string>, columnValues: Array<unknown>): Promise<number> {
   try{
      // Specify query command and parameters
      const queryParams = {
         text: insertIntoTable(tableName, columnNames),
         values: columnValues
      };
      const res = await client.query(queryParams);
      return res.rows[0].id;
   }catch(err){
      console.log('ERROR: createPackage Failed. ' + err);
      return -1;
   }
}
/**
 * Update an existing entry in a given table with given values
 * @param client The pool client object
 * @param tableName The name of the table to make an update in
 * @param columnNames The names of the columns to update 
 * @param columnValues The values to update
 * @param id The ID of the entry to be updated
 * @return A promise which resolves to a number. The entry ID
 * is returned on a successful update, 0 is returned if the postgres
 * client can't update the object, -1 is returned if an error occurs
 */
export async function dbUpdate(client: PoolClient, tableName: string, columnNames: Array<string>, columnValues: Array<unknown>, id: number): Promise<number> {
   try{
      // Specify query command and parameters
      const queryParams = {
         text: updateById(tableName, columnNames, id),
         values: columnValues
      };
      const res = await client.query(queryParams);
      // Return success code
      return id;
   }catch(err){
      console.log('ERROR: Update Failed. ' + err);
      return -1;
   }
}

/**
 * Reads an entry of a given id from a given table
 * @param client The postgres client
 * @param tableName The name of the table to make a query in
 * @param id The ID of the entry to be targeted
 * @return A promise which resolves to a valid SQL query object or null otherwise
 */
export async function dbReadById(client: PoolClient, tableName: string, id: number): Promise<any|null>{
   console.log('id: ' + id);
   const queryParams = {
      text: `SELECT * FROM ${tableName} WHERE id = $1`,
      values: [id]
   };
   try{
      const res = await client.query(queryParams);
      return res.rows[0];
   }catch(err){
      console.log('ERROR: read Failed. ' + err);
      return null;
   }
}

/**
 * Deletes an entry of a given id from a given table
 * @param client: The postgres client
 * @param tableName: The name of the table to make a query in
 * @param id: The ID of the entry to be targeted
 * @return 0 on success, -1 on failure
 */
export async function dbRemove(client: PoolClient, tableName: string, id: number): Promise<number>{
   const queryParams = {
      text: `DELETE FROM ${tableName} WHERE id = $1`,
      values: [id]
   };
   try{
      await client.query(queryParams);
      return 0;
   }catch(err){
      console.log('ERROR: remove Failed.', err);
      return -1;
   }
}

export async function dbReadPackageFlag(client: PoolClient, packageId: number): Promise<Array<Record<string, unknown>>|null>{
   const queryParams = {
      text: `SELECT * FROM ${TableNames.PACKAGE_FLAG} WHERE packageId = $1`,
      values: [packageId]
   };
   try{
      const res = await client.query(queryParams);
      return res.rows;
   }catch(err){
      console.log('ERROR: read operation for PackageFlag failed.', err);
      return null;
   }
}

export async function dbFind(client: PoolClient, tableName: string, columnNames: Array<string>, columnValues: Array<unknown>): Promise<Array<Record<string, unknown>>>{
   const queryParams = {
      text: `SELECT * FROM ${tableName} WHERE ${generateSelectQuery(columnNames)}`,
      values: [columnValues]
   };
   try{
      const res = await client.query(queryParams);
      return res.rows;
   }catch(err){
      throw new Error('ERROR: find operation failed');
   }
}
