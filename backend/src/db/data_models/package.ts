import { PoolClient } from 'pg';
import {dbCreate, dbReadById, dbUpdate, dbRemove} from '../dbOperations';
import TableNames from '../enums/tableNames';
class Package {
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
   private updatedFields: Set<string>;
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
      this.updatedFields = new Set();
   }

   public static async getInstance(client: PoolClient, id:number): Promise<Package|null>{
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
    * @returns 
    */
   private async insert(): Promise<number>{
      this.setLastUpdated();
      const columnNames: Array<string> = ['userId', 'lastUpdated','numApiCalls','name',
         'category', 'description', 'input', 'output', 'markdown'];
      const columnValues: Array<unknown> = [ this.userId, this.lastUpdated, this.numApiCalls, this.name,
         this.category, this.description, this.input, this.output, this.markdown];
      return await dbCreate(this.client, this.tableName, columnNames, columnValues);
   }

   private async update(): Promise<number>{
      if(this.updatedFields.size == 0)
         return 0;
      this.setLastUpdated();
      const columnNames: Array<string> = [];
      const columnValues: Array<unknown> = [];
      this.updatedFields.forEach(fieldName =>{
         columnNames.push(fieldName);
         columnValues.push(this[fieldName as keyof Package]);
      });
      return await dbUpdate(this.client, this.tableName, columnNames, columnValues, this.id);
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
         this.updatedFields.add('userId');
         return 0;
      }
      return -1;
   }

   public getLastUpdated(): Date{
      return this.lastUpdated;
   }

   private setLastUpdated(): void{
      this.lastUpdated = new Date();
      this.updatedFields.add('lastUpdated');
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
         this.updatedFields.add('name');
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
         this.updatedFields.add('description');
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
         this.updatedFields.add('input');
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
         this.updatedFields.add('output');
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
         this.updatedFields.add('markdown');
         return 0;
      }
      return -1;
   }
}

export default Package;