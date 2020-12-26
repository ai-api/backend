import {createPackage, updatePackage, remove} from '../dbOperations';
import TableNames from '../enums/tableNames';
interface Package {
    id?: number;
    userId: number;
    lastUpdated?: Date;
    numApiCalls?: number;
    name: string;
    category: string;
    description: string;
    input: string;
    output: string;
    markdown?: string;
    flags: Array<string>;
}

class Package {
   /*
    * @userId: The user's unique ID number
    * @name: The name of the package
    * @category: The category of the package
    * @description: A short description of the package
    * @input: An example input for the AI model
    * @output: The output of the example input
    * @flags: (Optional) An array of the different flags associated with the package.
    * Defaults to an empty array
    * @id: (Optional) The table id of the package. Defaults to -1
    * @lastUpdated: (Optional) Date of the last update to the package. Defaults to empty string
    * @numApiCalls: (Optional) Number of times this package's model was requested. Defaults to 0
    * @markdown: (Optional) markdown file. Defaults to empty string
    */
   constructor(userId: number, name: string, category: string, description: string, input: string, 
      output: string, id = -1, lastUpdated = new Date(), numApiCalls = 0, markdown = ''){
      this.id = id;
      this.userId = userId;
      this.lastUpdated = lastUpdated;
      this.numApiCalls = numApiCalls;
      this.name = name;
      this.category = category;
      this.description = description;
      this.input = input;
      this.output = output;
      this.markdown = markdown;
   }
   /*
     * Creates a new package entry in the package table using
     * the fields in the current object
     * @client: The postgres client object
     * Return: None
     */
   async create(client: any): Promise<number>{
      return await createPackage(client, this);
   }
   async update(client: any): Promise<number>{
      return await updatePackage(client, this); 
   }
   async delete(client: any): Promise<number>{
      if(this.id){
         return await remove(client, TableNames.PACKAGE, this.id);
      }
      return -1;
   }
}
export default Package;