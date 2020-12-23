import { Client } from 'pg';
import Package from './data_models/package'

/*
 * SQL queries with parameters require a string which says
 * what index each value is located at in the values array
 * 
 */
function getIndicesString(numParams: number): string{
   var result: Array<string> = [];
   for(let i = 1; i <= numParams; i++)
      result.push(`$${i}`);
   return result.join();
}

/*
 * Gets the current date
 * Return: the date in MM/DD/YYYY format
 */
function getDate(): string{
   var date = new Date();
   var dd = String(date.getDate()).padStart(2, '0');
   var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0
   var yyyy = date.getFullYear();
   return mm + '/' + dd + '/' + yyyy;
}

/*
 * Creates a new package entry in the package table
 * @client: The postgres client
 * @model: The data model object to be updated in the database
 * Return: The id of the new entry, -1 otherwise
 */
export function createPackage(client: any, model: Package): number{
   const tableName: string = 'package';
   const date = getDate();
   const columnNames: Array<string> = ['userId','lastUpdated','numApiCalls','name',
      'category', 'description', 'input', 'output', 'markdown'];
   const columnValues: Array<any> = [model.userId, date, 0, model.name,
      model.category, model.description, model.input, model.output, model.markdown];
   var valueIndices: string = getIndicesString(columnValues.length);
   // Specify query command and parameters
   const queryParams: object = {
      text: `INSERT INTO ${tableName}(${columnNames.join()}) VALUES(${valueIndices})`,
      values: columnValues
   }
   // Insert the new package entry
   client.query(queryParams, (err: any, res: any) =>{
      if(err)
         console.log(err);
      else
         console.log(res);
   });
   //TODO: Create respective flag-package entries in the flag_package table
   return 0;
}

/*
 * Reads an entry of a given id from a given table
 * @client: The postgres client
 * @tableName: The name of the table to make a query in
 * @id: The ID of the entry to be targeted
 * Return: A corresponding data model object
 */
export function read(client: any, tableName: string, id: number): object{
   const queryParams: object = {
      text: 'SELECT * FROM $1 WHERE id = $2',
      values: [tableName, id]
   };
   client.query(queryParams, (err: any, res: any) =>{
      if(err)
         console.log(err);
      else
         console.log(res);
   });
   //TODO: Create Data Model Object
   return {};
}

/*
 * Updates an entry in the database
 * @client: The postgres client
 * @id: The ID of the entry to be targeted
 * @model: The data model object to be updated in the database
 * Return: 0 on success, -1 on failure
 */
export function update(client: any, id: number, model: object): number{
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
   const queryParams: object = {
      text: 'DELETE * FROM $1 WHERE id = $2',
      values: [tableName, id]
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

