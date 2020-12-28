import { PoolClient } from 'pg';
import {dbCreate, dbReadById, dbUpdate, dbRemove} from '../dbOperations';
import TableNames from '../enums/tableNames';
class Package {
   // TODO: write static get and create functions
   // TODO: combine create and update functions into a save function
   // TODO: Find way to keep tack of fields that need to be updated
   // TODO: Pass client into constructor
   // TODO: save category as category id rather than string
   private client: PoolClient;
   private tableName: string;
   private id: number;
   private userId: number;
   private lastUpdated: Date;
   private numApiCalls: number;
   private name: string;
   private category: number;
   private description: string;
   private input: string;
   private output: string;
   private markdown: string;
   /*
    * @userId: The user's unique ID number
    * @name: The name of the package
    * @category: The category of the package
    * @description: A short description of the package
    * @input: An example input for the AI model
    * @output: The output of the example input
    * @id: (Optional) The table id of the package. Defaults to -1
    * @lastUpdated: (Optional) Date of the last update to the package. Defaults to empty string
    * @numApiCalls: (Optional) Number of times this package's model was requested. Defaults to 0
    * @markdown: (Optional) markdown file. Defaults to empty string
    */
   constructor(client: PoolClient, userId: number, name: string, category: number, description: string, input: string, 
      output: string, markdown = '', id = -1, lastUpdated = new Date(), numApiCalls = 0){
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
      this.client = client;
      this.tableName = TableNames.PACKAGE;
   }

   public static async readInstance(client: PoolClient, id:number): Promise<Package|null>{
      const data = await dbReadById(client, TableNames.PACKAGE, id);
      if(data)
         return new Package(client, data.userid, data.name, data.category, data.description, data.input,
            data.output, data.markdown, data.id, data.lastupdated, data.numapicalls);
      return null;
   }

   public static createInstance(client: PoolClient, userId: number, name: string, category: number, description: string, 
      input: string, output: string, markdown = ''): Package|null{

      if(client && userId && name && category && description && input && output)
         return new Package(client, userId, name, category, description, input, output, markdown);
      return null;
   }

   public async save(): Promise<number>{
      if(this.id)
         return await this.update();
      return await this.insert();
   }
   /**
    * Creates a new package entry in the package table using
    * the fields in the current object
    * @param client The postgres client object
    * Return: None
    */
   private async insert(): Promise<number>{
      return 0;
   }
   private async update(): Promise<number>{
      return 0;
   }
   public async delete(): Promise<number>{
      if(this.id){
         return await dbRemove(this.client, this.tableName, this.id);
      }
      return -1;
   }

   
   public getId(): number{
      return this.id;
   }

   public getUserId(): number{
      return this.userId;
   }

   public setUserId(newId: number): number{
      if(newId >= 1){
         this.userId = newId;
         return 0;
      }
      return -1;
   }

   public getLastUpdated(): Date{
      return this.lastUpdated;
   }

   public getNumApiCalls(): number{
      return this.numApiCalls;
   }

   public getName(): string{
      return this.name;
   }

   public setName(newName: string): number{
      if(newName){
         this.name = newName;
         return 0;
      }
      return -1; 
   }

   public getCategory(): string{
      return 'TODO';
   }

   public setCategory(): number{
      //TODO
      return 0;
   }

   public getDescription(): string{
      return this.description;
   }

   public setDescription(newDescription: string): number{
      if(newDescription){
         this.description = newDescription;
         return 0;
      }
      return -1;
   }

   public getInput(): string{
      return this.input;
   }

   public setInput(newInput: string): number{
      if(newInput){
         this.input = newInput;
         return 0;
      }
      return -1;
   }

   public getOutput(): string{
      return this.output;
   }

   public setOutput(newOutput: string): number{
      if(newOutput){
         this.output = newOutput;
         return 0;
      }
      return -1;
   }

   public getMarkdown(): string{
      return this.markdown;
   }

   public setMarkdown(newMarkdown:string): number{
      if(newMarkdown){
         this.markdown = newMarkdown;
         return 0;
      }
      return -1;
   }
}
// private client: PoolClient;
// private tableName: string;
// private id?: number;
// private userId: number;
// private lastUpdated?: Date;
// private numApiCalls?: number;
// private name: string;
// private category: string;
// private description: string;
// private input: string;
// private output: string;
// private markdown?: string;
export default Package;