import { PoolClient } from 'pg';
import {dbCreate, dbReadById, dbUpdate, dbRemove} from '../../db/dbOperations';
import TableNames from '../../db/enums/tableNames';

export default class PackageFlag {
   private sysId: number;
   private flag: number;
   private package: number;
   private client: PoolClient;
   private updatedFields: Set<string>;
   private tableName: string;
   private constructor(client: PoolClient, flagId: number, packageId: number, id = -1){
      this.client = client;
      this.sysId = id;
      this.flag = flagId;
      this.package = packageId;
      this.updatedFields = new Set();
      this.tableName = TableNames.PACKAGE_FLAG;
   }
   
   public static async getInstance(client: PoolClient, id: number): Promise<PackageFlag>{
      const data = await dbReadById(client, TableNames.PACKAGE_FLAG, id);
      if(!data)
         throw new Error('PackageFlag information could not be retrieved from database');
      return new PackageFlag(client, data.flagid, data.packageid, data.id);
   }

   public static createInstance(client: PoolClient, flagId: number, packageId: number): PackageFlag{
      if(flagId < 1 && packageId < 1)
         throw new Error('One or more invalid paramters');
      return new PackageFlag(client, flagId, packageId);
   }

   /**
    * Updates the corresponding PackageFlag entry in the database if
    * one exists, otherwise create a new PackageFlag entry in the database
    * @return A promise which resolves to a number. The packageFlag ID
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
      const columnNames: Array<string> = ['packageId', 'flagId'];
      const columnValues: Array<unknown> = [this.package, this.flag];
      const id = await dbCreate(this.client, this.tableName, columnNames, columnValues);
      if(id < 1)
         throw new Error('PackageFlag could not be created');
      this.setId(id);
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
      const columnNames: Array<string> = [];
      const columnValues: Array<unknown> = [];
      this.updatedFields.forEach(fieldName =>{
         columnNames.push(fieldName);
         columnValues.push(this[fieldName as keyof PackageFlag]);
      });
      const id = await dbUpdate(this.client, this.tableName, columnNames, columnValues, this.sysId);
      if(id < 1)
         throw new Error('PackageFlag could not be updated');
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

   public get id(): number{
      return this.sysId;
   }

   /**
    * Sets the ID of the PackageFlag object
    */
   private setId(newId: number): void{
      if(newId <= 0)
         throw new Error('New ID is invalid');
      this.sysId = newId;
   }

   public get packageId(): number{
      return this.package;
   }

   public set packageId(newId: number){
      if(newId < 1)
         throw new Error('New ID is Invalid');
      this.package = newId;
   }

   public get flagId(): number{
      return this.flag;
   }

   public set flagId(newId: number){
      if(newId < 1)
         throw new Error('New ID is Invalid');
      this.flag = newId;
   }
}