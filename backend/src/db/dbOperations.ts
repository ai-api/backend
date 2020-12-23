import Package from './data_models/package'

/*
 * Creates a new package entry in the package table
 * @client: The postgres client
 * @model: The data model object to be updated in the database
 * Return: The id of the new entry, -1 otherwise
 */
export function createPackage(client: object, model: Package): number{
   // New package must atleast have an associated userID
   if(!model.userId)
      return -1;

   const tableName: string = 'package';
   var modelColumns: Array<string> = Object.keys(model);
   console.log('modelColumns:', modelColumns);
   var paramIndices: Array<string> = [];
   var values: Array<any> = [];
   var numParams = 1;
   for(var column in modelColumns){
      paramIndices.push(`$${numParams}`)
      values.push(model[column as keyof Package])
      numParams++;
   }
   console.log('paramIndices:', paramIndices);
   console.log('values:', values);
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

