import { PoolClient } from 'pg';
import {dbCreate, dbReadById, dbUpdate, dbRemove, dbReadPackageFlag} from '../../db/dbOperations';
import TableNames from '../../db/enums/tableNames';
import PackageFlag from './packageFlag';
import HttpPackage from '../httpModels/httpPackage';
class Package {
   private client: PoolClient;
   private tableName: string;
   private sysId: number;
   private user: number;
   private lastUpdated: Date;
   private apiCalls: number;
   private packageName: string;
   private categoryId: number;
   private shortDescription: string;
   private modelInput: string;
   private modelOutput: string;
   private packageFlags: Array<PackageFlag>;
   private md: string;
   private updatedFields: Set<string>;

   /**
    * @param client The postgres client used to make database queries
    * @param userId: The user's unique ID number
    * @param name The name of the package
    * @param category: The category of the package
    * @param description: A short description of the package
    * @param input An example input for the AI model
    * @param output The output of the example input
    * @param markdown (Optional) markdown file. Defaults to empty string
    * @param id (Optional) The table id of the package. Defaults to -1
    * @param lastUpdated (Optional) Date of the last update to the package. Defaults to empty string
    * @param numApiCalls (Optional) Number of times this package's model was requested. Defaults to 0
    */
   private constructor(client: PoolClient, userId: number, name: string, category: number, description: string, input: string, 
      output: string, flags: Array<PackageFlag>, markdown = '', id = -1, lastUpdated = new Date(), numApiCalls = 0){
      this.sysId = id;
      this.user = userId;
      this.lastUpdated = lastUpdated;
      this.apiCalls = numApiCalls;
      this.packageName = name;
      this.categoryId = category;
      this.shortDescription = description;
      this.modelInput = input;
      this.modelOutput = output;
      this.packageFlags = flags;
      this.md = markdown;
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
      try{
         const [packageData, packageFlags] = await Promise.all([dbReadById(client, TableNames.PACKAGE, id), PackageFlag.getInstances(client, id)]);
         // Check if packageData is an empty object
         if(Object.keys(packageData).length === 0 && packageData.constructor === Object)
            throw new Error('Package information could not be retrieved from database');

         return new Package(client, packageData.userid, packageData.name, packageData.category, packageData.description, packageData.input,
            packageData.output, packageFlags, packageData.markdown, packageData.id, packageData.lastupdated, packageData.numapicalls);
      }catch(err){
         throw new Error(err);
      }
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
      input: string, output: string, flags: Array<PackageFlag>, markdown = ''): Package{
      return new Package(client, userId, name, category, description, input, output, flags, markdown);
   }

   /**
    * Updates the corresponding Package entry in the database if
    * one exists, otherwise create a new Package entry in the database
    * @return A promise which resolves to a number. The package ID
    * is returned on a successful save, 0 is returned if the postgres
    * client can't save the object
    */
   public async save(): Promise<number>{
      try{
         if(this.sysId >= 1)
            return await this.update();
         return await this.create();
      }catch(err){
         throw new Error(err);
      }
   }

   /**
    * Creates a new package entry in the package table using
    * the fields in the current object
    * @return A promise which resolves to a number. The package ID
    * is returned on a successful insert
    */
   private async create(): Promise<number>{
      this.packageFlags.forEach((packageFlag=>{
         packageFlag.save();
      }));
      this.setLastUpdated();
      const columnNames: Array<string> = ['userId', 'lastUpdated','numApiCalls','name',
         'category', 'description', 'input', 'output', 'markdown'];
      const columnValues: Array<unknown> = [ this.user, this.lastUpdated, this.apiCalls, this.packageName,
         this.categoryId, this.shortDescription, this.modelInput, this.modelOutput, this.md];
      const id = await dbCreate(this.client, this.tableName, columnNames, columnValues);
      return id;
   }

   /**
    * Updates an existing package entry in teh database using the 
    * altered fields in the current object
    * @return A promise which resolves to a number. The package ID
    * is returned on a successful update, 0 is returned if the postgres
    * client can't update the object
    */
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
      const id = await dbUpdate(this.client, this.tableName, columnNames, columnValues, this.sysId);
      if(id < 1)
         throw new Error('Package could not be updated');
      this.updatedFields.clear();
      return id;
   }

   /**
    * Deletes the package corresponding to this package in the 
    * database
    * @return Promise which resolves to 0 for a successful removal
    * or -1 otherwise
    */
   public async delete(): Promise<number>{
      if(this.sysId < 1)
         return -1;
      const returnStatus = await dbRemove(this.client, this.tableName, this.sysId);
      if(returnStatus == -1)
         throw new Error('Delete Failed');
      this.sysId = -1;
      return 0;
   }
   
   /**
    * Gets the ID of the package object
    * @return ID number of the package
    */
   public get id(): number{
      return this.sysId;
   }

   /**
    * Sets the ID of the package object
    */
   private setId(newId: number): void{
      if(newId <= 0)
         throw new Error('New ID is Invalid');
      this.sysId = newId;
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
      if(newId < 1)
         throw new Error('Invalid ID number');
      this.user = newId;
      this.updatedFields.add('userId');
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
   public get numApiCalls(): number{
      return this.apiCalls;
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
      if(!newName)
         throw new Error('New name is Invalid');
      this.packageName = newName;
      this.updatedFields.add('name');
      
   }

   /**
    * Gets the category ID of the package
    * @returns category ID associated with the package
    */
   public get category(): number{
      return this.categoryId;
   }

   /**
    * Changes the category ID associated with the package
    * @param newCategory The new category to change to
    */
   public set category(newCategory: number){
      if(newCategory <= 0)
         throw new Error('New category ID is invalid');
      this.categoryId = newCategory;
      this.updatedFields.add('category');
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
    */
   public set description(newDescription: string){
      if(!newDescription)
         throw new Error('Invalid description');
      this.shortDescription = newDescription;
      this.updatedFields.add('description');
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
    */
   public set input(newInput: string){
      if(!newInput)
         throw new Error('New input is invalid');
      this.modelInput = newInput;
      this.updatedFields.add('input');
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
    */
   public set output(newOutput: string){
      if(!newOutput)
         throw new Error('New output is invalid');
      this.modelOutput = newOutput;
      this.updatedFields.add('output');
   }

   /**
    * Gets the raw markdown of the package
    * @return package markdown
    */
   public get markdown(): string{
      return this.md;
   }

   /**
    * Changes the mardown of the package
    * @param newName The new markdown to change to
    */
   public set markdown(newMarkdown:string){
      if(!newMarkdown)
         throw new Error('New markdown is Invalid');
      this.md = newMarkdown;
      this.updatedFields.add('markdown');
      
   }
}

export default Package;