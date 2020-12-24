import { Client } from 'pg';
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
export async function createPackage(client: any, model: Package): Promise<number>{
   //TODO: make sure package name is not taken
   //TODO: store flag entries in package-flag table
   const tableName = TableNames.PACKAGE;
   const date: Date = new Date();
   const columnNames: Array<string> = ['userId','lastUpdated','numApiCalls','name',
      'category', 'description', 'input', 'output', 'markdown'];
   console.log('DATE: ',date);
   const columnValues: Array<unknown> = [model.userId, date, model.numApiCalls, model.name,
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
      // Return the ID of the new entry
      return res.rows[0].id;
   }catch(err){
      console.log('ERROR: createPackage Failed. ' + err);
      return -1;
   }
}

/*
 * Reads the package entry of a given id
 * @client: The postgres client
 * @id: The ID of the package to be read
 * Return: A promise which resolves to a valid package object or null otherwise
 */
export async function readPackage(client: any, id: number): Promise<Package|null>{
   //TODO: get flags from flag-package table asynchronously
   const tableName = TableNames.PACKAGE;
   const data = await read(client, tableName, id);
   console.log('READ DATA:', data);
   //Make sure data object is not null
   if(data){
      return new Package(data.userid, data.name, data.category, data.description, data.input,
         data.output, undefined, data.id, data.lastupdated, data.numapicalls, data.markdown);
   }
   return null;
}

/*
 * Reads an entry of a given id from a given table
 * @client: The postgres client
 * @tableName: The name of the table to make a query in
 * @id: The ID of the entry to be targeted
 * Return: A promise which resolves to a valid SQL query object or null otherwise
 */
export async function read(client: any, tableName: string, id: number): Promise<any|null>{
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

/*
 * Updates an entry in the database
 * @client: The postgres client
 * @id: The ID of the entry to be targeted
 * @model: The data model object to be updated in the database
 * Return: 0 on success, -1 on failure
 */
export function update(client: any, id: number, model: any): number{
   //TODO
   return 0;
}

/*
 * Deletes an entry of a given id from a given table
 * @client: The postgres client
 * @tableName: The name of the table to make a query in
 * @id: The ID of the entry to be targeted
 * Return: 0 on success, -1 on failure
 */
export function remove(client: any, tableName: string, id: number): number{
   const queryParams = {
      text: `DELETE * FROM ${tableName} WHERE id = $1`,
      values: [id]
   };
   client.query(queryParams, (err: any, res: any) =>{
      if(err){
         console.log(err);
         return -1;
      }else{
         console.log(res.rows);
      }
            
   });
   return 0;
}

