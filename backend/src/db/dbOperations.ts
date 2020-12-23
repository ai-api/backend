import { Client } from 'pg';
import Package from './data_models/package'

/*
 * SQL queries with parameters require a string which says
 * what index each value is located at in the values array
 * @numParams: The number of parameters in the SQL query
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
 * Return: 0 on successful insertion, -1 otherwise
 */
export function createPackage(client: any, model: Package): number{
   //TODO: make sure package name is not taken
   let tableName: string = 'package';
   let date: string = getDate();
   let columnNames: Array<string> = ['userId','lastUpdated','numApiCalls','name',
      'category', 'description', 'input', 'output', 'markdown'];
   let columnValues: Array<unknown> = [model.userId, date, 0, model.name,
      model.category, model.description, model.input, model.output, model.markdown];
   let valueIndices: string = getIndicesString(columnValues.length);
   // Specify query command and parameters
   let queryParams: object = {
      text: `INSERT INTO ${tableName}(${columnNames.join()}) VALUES(${valueIndices})`,
      values: columnValues
   }
   // Insert the new package entry
   client.query(queryParams, (err: any, res: any) =>{
      if(err){
         console.log(err);
         return -1
      }else{
         console.log(res);
      }
   });
   //TODO: Create respective flag-package entries in the flag_package table
   return 0;
}

/*
 * Reads the package entry of a given id
 * @client: The postgres client
 * @id: The ID of the package to be read
 * Return: A valid package object, null otherwise
 */
export function readPackage(client: any, id: number): Package | null{
   let queryParams: object = {
      text: `SELECT * FROM package WHERE id = $1`,
      values: [id]
   };
   client.query(queryParams) 
      .then((res:any)=>{
         console.log(res.rows[0]);
         return new Package(res.userId, res.name, res.category, res.description,
            res.input, res.output, ['placeholderFlags'])
      })
      .catch((err:any) =>{
         console.log('ERROR: Table item could not be read',err);
         return null;
      });
   //TODO: get flags from flag-package table
   return null;
}

/*
 * Reads an entry of a given id from a given table
 * @client: The postgres client
 * @tableName: The name of the table to make a query in
 * @id: The ID of the entry to be targeted
 * Return:
 */
export async function read(client: any, tableName: string, id: number): Promise<any|null>{
   let queryParams: object = {
      text: `SELECT * FROM ${tableName} WHERE id = $1`,
      values: [id]
   };
   await client.query(queryParams) 
      .then((res:any)=>{
         console.log(res.rows[0]);
         return res.rows[0]
      })
      .catch((err:any) =>{
         console.log('ERROR: Table item could not be read',err);
         return null;
      });  
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

