import { PoolClient } from 'pg';
import {dbCreate, dbReadById, dbUpdate, dbRemove} from '../dbOperations';
import TableNames from '../enums/tableNames';
class Package {
   private client: PoolClient;
   private tableName: string;
   private sysId: number;
   private user: number;
   private lastUpdated: Date;
   private numApiCalls: number;
   private packageName: string;
   private category: number;
   private shortDescription: string;
   private modelInput: string;
   private modelOutput: string;
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
   private constructor(client: PoolClient, userId: number, name: string, category: number, description: string, input: string, 
      output: string, markdown = '', id = -1, lastUpdated = new Date(), numApiCalls = 0){
      this.sysId = id;
      this.user = userId;
      this.lastUpdated = lastUpdated;
      this.numApiCalls = numApiCalls;
      this.packageName = name;
      this.category = category;
      this.shortDescription = description;
      this.modelInput = input;
      this.modelOutput = output;
      this.markdown = markdown;
      this.client = client;
      this.tableName = TableNames.PACKAGE;
      this.updatedFields = new Set();
   }

   /**
    * Initialized and returns a Package object using information from
    * an entry in the database with the given id
    * @param client A postgres client object retrieved from a pool
    * @param id The ID of the package in the database table
    * @return A promise which resolves to a package object
    */
   public static async getInstance(client: PoolClient, id: number): Promise<Package>{
      const data = await dbReadById(client, TableNames.PACKAGE, id);
      if(data)
         return new Package(client, data.userid, data.name, data.category, data.description, data.input,
            data.output, data.markdown, data.id, data.lastupdated, data.numapicalls);
      throw new Error('Package information could not be retrieved from database');
   }

   /**
    * Initialized and returns a new Package object using information 
    * provided by the user
    * @param client A postgres client object retrieved from a pool
    * @param userId The package creator's ID
    * @param name The name of the package
    * @param category The ID of the package's category
    * @param description A short description of the package
    * @param input An example input for the package model
    * @param output The output of the given example input
    * @param markdown A markdown file containing additional information
    * @return A Package object
    */
   public static createInstance(client: PoolClient, userId: number, name: string, category: number, description: string, 
      input: string, output: string, markdown = ''): Package{

      if(client && userId && name && category && description && input && output)
         return new Package(client, userId, name, category, description, input, output, markdown);
      throw new Error('One or more invalid method arguments');
   }

   /**
    * Updates the corresponding Package entry in the database if
    * one exists, otherwise create a new Package entry in the database
    * @return A promise which resolves to a number. The package ID
    * is returned on a successful save, 0 is returned if the postgres
    * client can't save the object, -1 is returned if an error occurs
    */
   public async save(): Promise<number>{
      if(this.sysId >= 1)
         return await this.update();
      return await this.create();
   }
   /**
    * Creates a new package entry in the package table using
    * the fields in the current object
    * @return A promise which resolves to a number. The package ID
    * is returned on a successful insert, 0 is returned if the postgres
    * client can't insert the object, -1 is returned if an error occurs
    */
   private async create(): Promise<number>{
      console.log('CREATING NEW PACKAGE');
      this.setLastUpdated();
      const columnNames: Array<string> = ['userId', 'lastUpdated','numApiCalls','name',
         'category', 'description', 'input', 'output', 'markdown'];
      const columnValues: Array<unknown> = [ this.user, this.lastUpdated, this.numApiCalls, this.packageName,
         this.category, this.shortDescription, this.modelInput, this.modelOutput, this.markdown];
      return await dbCreate(this.client, this.tableName, columnNames, columnValues);
   }

   /**
    * Updates an existing package entry in teh database using the 
    * altered fields in the current object
    * @return A promise which resolves to a number. The package ID
    * is returned on a successful update, 0 is returned if the postgres
    * client can't update the object, -1 is returned if an error occurs
    */
   private async update(): Promise<number>{
      console.log('UPDATING EXISTING PACKAGE');
      if(this.updatedFields.size == 0)
         return 0;
      this.setLastUpdated();
      const columnNames: Array<string> = [];
      const columnValues: Array<unknown> = [];
      this.updatedFields.forEach(fieldName =>{
         columnNames.push(fieldName);
         columnValues.push(this[fieldName as keyof Package]);
      });
      return await dbUpdate(this.client, this.tableName, columnNames, columnValues, this.sysId);
   }

   /**
    * Deletes the package corresponding to this package in the 
    * database
    * @return Promise which resolves to 0 for a successful removal
    * or -1 otherwise
    */
   public async delete(): Promise<number>{
      if(this.sysId >= 1){
         await dbRemove(this.client, this.tableName, this.sysId);
         return 0;
      }
      return -1;
   }
   
   /**
    * Gets the ID of the package object
    * @return ID number of the package
    */
   public get idNum(): number{
      return this.sysId;
   }

   /**
    * Gets the ID of the user who owns the package
    * @return ID number of the user
    */
   public get userId(): number{
      return this.user;
   }

   /**
    * Changes the user ID associated with the package
    */
   public set userId(newId: number){
      if(newId >= 1){
         this.user = newId;
         this.updatedFields.add('userId');
         return;
      }
      throw new Error('Invalid ID number');
   }

   /**
    * Gets the date when this package was last updated
    * @return Date object of last update
    */
   public get dateLastUpdated(): Date{
      return this.lastUpdated;
   }

   /**
    * Changes the date of the last update to the current date
    */
   private setLastUpdated(): void{
      this.lastUpdated = new Date();
      this.updatedFields.add('lastUpdated');
   }

   /**
    * Gets the number of times the package model was requested
    * @return number of API calls made to the package
    */
   public get apiCalls(): number{
      return this.numApiCalls;
   }

   /**
    * Gets the name of the package
    * @return name of the package
    */
   public get name(): string{
      return this.packageName;
   }

   /**
    * Changes the name of the package
    * @param newName The new name to change to
    */
   public set name(newName: string){
      if(newName){
         this.packageName = newName;
         this.updatedFields.add('name');
         return;
      }
      throw new Error('Invalid name');
   }

   /**
    * Gets the category ID of the package
    * @returns category ID associated with the package
    */
   public get categoryId(): number{
      return this.category;
   }

   /**
    * Changes the category ID associated with the package
    * @param newCategory The new category to change to
    * @return -1 if newCategory is invalid, 0 otherwise
    */
   public set categoryId(newCategory: number){
      if(newCategory >= 1){
         this.category = newCategory;
         this.updatedFields.add('category');
         return;
      }
      throw new Error('Invalid category id');
   }

   /**
    * Gets the short description of the package
    * @return package description
    */
   public get description(): string{
      return this.shortDescription;
   }

   /**
    * Changes the description of the package
    * @param newName The new description to change to
    * @return -1 if newDescription is invalid, 0 otherwise
    */
   public set description(newDescription: string){
      if(newDescription){
         this.shortDescription = newDescription;
         this.updatedFields.add('description');
         return;
      }
      throw new Error('Invalid description');
   }

   /**
    * Gets the example input of the package model
    * @returns Example model input
    */
   public get input(): string{
      return this.modelInput;
   }

   /**
    * Changes the input of the package
    * @param newInput The new input to change to
    * @return -1 if newInput is invalid, 0 otherwise
    */
   public set input(newInput: string){
      if(newInput){
         this.modelInput = newInput;
         this.updatedFields.add('input');
         return;
      }
      throw new Error('Invalid input');
   }

   /**
    * Gets the example output of the package model
    * @return Example model output
    */
   public get output(): string{
      return this.modelOutput;
   }

   /**
    * Changes the example output of the package
    * @param newName The new output to change to
    * @return -1 if newOutput is invalid, 0 otherwise
    */
   public set output(newOutput: string){
      if(newOutput){
         this.modelOutput = newOutput;
         this.updatedFields.add('output');
         return;
      }
      throw new Error('Invalid output');
   }

   /**
    * Gets the raw markdown of the package
    * @return package markdown
    */
   public get md(): string{
      return this.markdown;
   }

   /**
    * Changes the mardown of the package
    * @param newName The new markdown to change to
    * @return -1 if newMarkdown is invalid, 0 otherwise
    */
   public set md(newMarkdown:string){
      if(newMarkdown){
         this.markdown = newMarkdown;
         this.updatedFields.add('markdown');
         return;
      }
      throw new Error('Invalid markdown');
   }
}

export default Package;