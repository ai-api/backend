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
         console.log(res.rows);
   });
   //TODO: Create Data Model Object
   return {};
}

export function update(client: any, tableName: string, id: number, columnNames: Array<string>, columnValues: Array<any>): number{
   //TODO
   return 1;
}

/*
 * Deletes an entry of a given id from a given table
 * @client: The postgres client
 * @tableName: The name of the table to make a query in
 * @id: The ID of the entry to be targeted
 * Return: 1 on success, 0 on failure
 */
export function remove(client: any, tableName: string, id: number): number{
   const queryParams: object = {
      text: 'DELETE * FROM $1 WHERE id = $2',
      values: [tableName, id]
   };
   client.query(queryParams, (err: any, res: any) =>{
      if(err){
         console.log(err);
         return 0;
      }else{
         console.log(res.rows);
      }
            
   });
   return 1;
}

