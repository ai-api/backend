import { Client, PoolClient } from 'pg';
import TableNames from './enums/tableNames';
import Package from './data_models/package';

/*
 * SQL queries with parameters require a string which says
 * what index each value is located at in the values array
 * @numParams: The number of parameters in the SQL query
 */
function getIndicesString(numParams: number): string{
   const result: Array<string> = [];
   for(let i = 1; i <= numParams; i++)
      result.push(`$${i}`);
   return result.join();
}

/*
 * Generates a query string to update an entry of a given id at a given table
 * @model: A data model object to be updated in the database
 * @tableName: The name of the table to construct the query for
 */
function updateById(tableName: string, columnNames: Array<string>, id: number): string{

   // Setup static beginning of query
   const query = [`UPDATE ${tableName} SET`];
   // Create another array storing each set command
   // and assigning a number value for parameterized query
   const set = columnNames.map((column, index)=>{
      return `${column} = ($${index + 1})`;
   }); 
   query.push(set.join());
   // Add the WHERE statement to look up by id
   query.push(`WHERE id = ${id}`);
   // Return a complete query string
   return query.join(' ');
}



/*
 * Gets the current date
 * Return: the date in MM/DD/YYYY format
 */
function getDate(date: Date): string{
   const dd = String(date.getDate()).padStart(2, '0');
   const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0
   const yyyy = date.getFullYear();
   return mm + '/' + dd + '/' + yyyy;
}

/*
 * Creates a new package entry in the package table
 * @client: The postgres client
 * @model: The data model object to be updated in the database
 * Return: ID of entry on successful insertion, -1 otherwise
 */
/*
export async function createPackage(client: PoolClient, model: Package): Promise<number>{
   //TODO: make sure package name is not taken
   //TODO: store flag entries in package-flag table
   console.log('TYPE OF MODEL:', client.constructor.name);
   const tableName = TableNames.PACKAGE;
   const date: Date = new Date();
   const columnNames: Array<string> = ['lastUpdated','userId','numApiCalls','name',
      'category', 'description', 'input', 'output', 'markdown'];
   console.log('DATE: ',date);
   const columnValues: Array<unknown> = [ date, model.userId, model.numApiCalls, model.name,
      model.category, model.description, model.input, model.output, model.markdown];
   const valueIndices: string = getIndicesString(columnValues.length);
   
   try{
      // Specify query command and parameters
      const queryParams = {
         text: `INSERT INTO ${tableName}(${columnNames.join()}) VALUES(${valueIndices}) RETURNING id`,
         values: columnValues
      };
      console.log('QUERYPARAMS: ', queryParams);
      const res = await client.query(queryParams);
      console.log('createPackage RESULT: ', res);
      return res.rows[0].id;
   }catch(err){
      console.log('ERROR: createPackage Failed. ' + err);
      return -1;
   }
}
*/

function insertIntoTable(tableName: string, columnNames: Array<string>): string {
   const valueIndices: string = getIndicesString(columnNames.length);
   return `INSERT INTO ${tableName}(${columnNames.join()}) VALUES(${valueIndices}) RETURNING id`;
}

export async function dbCreate(client: PoolClient, tableName: string, columnNames: Array<string>, columnValues: Array<unknown>): Promise<number> {
   try{
      // Specify query command and parameters
      const queryParams = {
         text: insertIntoTable(tableName, columnNames),
         values: columnValues
      };
      console.log('QUERYPARAMS: ', queryParams);
      const res = await client.query(queryParams);
      console.log('createPackage RESULT: ', res);
      return res.rows[0].id;
   }catch(err){
      console.log('ERROR: createPackage Failed. ' + err);
      return -1;
   }
}

export async function dbUpdate(client: PoolClient, tableName: string, columnNames: Array<string>, columnValues: Array<unknown>, id: number): Promise<number> {
   try{
      // Specify query command and parameters
      const queryParams = {
         text: updateById(tableName, columnNames, id),
         values: columnValues
      };
      console.log('QUERYPARAMS: ', queryParams);
      const res = await client.query(queryParams);
      console.log('Update RESULT: ', res);
      // Return success code
      return id;
   }catch(err){
      console.log('ERROR: Update Failed. ' + err);
      return -1;
   }
}

/*
 * Reads the package entry of a given id
 * @client: The postgres client
 * @id: The ID of the package to be read
 * Return: A promise which resolves to a valid package object or null otherwise
 */
/*
export async function readPackage(client: PoolClient, id: number): Promise<Package|null>{
   //TODO: get flags from flag-package table asynchronously
   const tableName = TableNames.PACKAGE;
   const data = await dbRead(client, tableName, id);
   console.log('READ DATA:', data);
   //Make sure data object is not null
   if(data){
      return new Package(data.userid, data.name, data.category, data.description, data.input,
         data.output, data.id, data.lastupdated, data.numapicalls, data.markdown);
   }
   return null;
}
*/

/*
export async function updatePackage(client: PoolClient, model: Package): Promise<number> {
   //TODO: Update flags in flag table
   // make sure package is valid and has a valid id
   if(!model || !model.id)
      return -1;
   const tableName = TableNames.PACKAGE;
   try{
      // Change lastUpdated field to current date
      const date: Date = new Date();
      model.lastUpdated = date;
      // Specify query command and parameters
      const queryParams = {
         text: updateById(model, tableName),
         values: Object.values(model)
      };
      console.log('QUERYPARAMS: ', queryParams);
      const res = await client.query(queryParams);
      console.log('createPackage RESULT: ', res);
      // Return success code
      return 0;
   }catch(err){
      console.log('ERROR: updatePackage Failed. ' + err);
      return -1;
   }
}
*/
/*
 * Reads an entry of a given id from a given table
 * @client: The postgres client
 * @tableName: The name of the table to make a query in
 * @id: The ID of the entry to be targeted
 * Return: A promise which resolves to a valid SQL query object or null otherwise
 */
export async function dbReadById(client: PoolClient, tableName: string, id: number): Promise<any|null>{
   const queryParams = {
      text: `SELECT * FROM ${tableName} WHERE id = $1`,
      values: [id]
   };
   try{
      const res = await client.query(queryParams);
      console.log(res);
      return res.rows[0];
   }catch(err){
      console.log('ERROR: read Failed. ' + err);
      return null;
   }
}

/*
 * Deletes an entry of a given id from a given table
 * @client: The postgres client
 * @tableName: The name of the table to make a query in
 * @id: The ID of the entry to be targeted
 * Return: 0 on success, -1 on failure
 */
export async function dbRemove(client: PoolClient, tableName: string, id: number): Promise<number>{
   const queryParams = {
      text: `DELETE FROM ${tableName} WHERE id = $1`,
      values: [id]
   };
   try{
      // Delete the entry
      await client.query(queryParams);
      return 0;
   }catch(err){
      console.log('ERROR: remove Failed.', err);
      return -1;
   }
}

