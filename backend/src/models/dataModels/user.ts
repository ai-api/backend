import { PoolClient } from 'pg';
import {dbCreate, dbReadById, dbUpdate, dbRemove} from '../../db/dbOperations';
import TableNames from '../../db/enums/tableNames';

class User {
   private sysId: number;
   private user: string;
   private pass: string;
   private emailAddress: string;
   private key: string;
   private picture: string;
   private client: PoolClient;
   private saltData: string;
   private updatedFields: Set<string>;
   private tableName: string;

   private constructor(client: PoolClient, username: string, password: string, email: string, apiKey: string, id: number, profilePicture: string, salt: string){
      this.client = client;
      this.user = username;
      this.pass = password;
      this.emailAddress = email;
      this.key = apiKey;
      this.sysId = id;
      this.saltData = salt;
      this.picture = profilePicture;
      this.updatedFields = new Set();
      this.tableName = TableNames.USER;
   }

   public static async getInstance(client: PoolClient, id: number): Promise<User>{
      const data = await dbReadById(client, TableNames.USER, id);
      if(data)
         return new User(client, data.username, data.password, data.email, data.apikey, data.id, data.profilepicture, data.salt);
      throw new Error('User information could not be retrieved from database');
   }

   public static createInstance(client: PoolClient, username: string, password: string, email: string, apiKey: string, profilePicture = '', salt: string): User{
      if(client && username && password && email && apiKey)
         return new User(client, username, password, email, apiKey, -1, profilePicture, salt);
      throw new Error('One or more invalid method arguments');
   }

   /**
    * Updates the corresponding User entry in the database if
    * one exists, otherwise create a new User entry in the database
    * @return A promise which resolves to a number. The User ID
    * is returned on a successful save, 0 is returned if the postgres
    * client can't save the object, -1 is returned if an error occurs
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
    * Creates a new User entry in the User table using
    * the fields in the current object
    * @return A promise which resolves to a number. The User ID
    * is returned on a successful insert, 0 is returned if the postgres
    * client can't insert the object, -1 is returned if an error occurs
    */
   private async create(): Promise<number>{
      const columnNames: Array<string> = ['username', 'password','email','apiKey', 'profilePicture', 'salt'];
      const columnValues: Array<unknown> = [ this.user, this.pass, this.emailAddress, this.key, this.picture, this.salt];
      const id = await dbCreate(this.client, this.tableName, columnNames, columnValues);
      this.setId(id);
      if(!id)
         throw new Error('Package could not be created');
      return id;
   }

   /**
    * Updates an existing User entry in the database using the 
    * altered fields in the current object
    * @return A promise which resolves to a number. The User ID
    * is returned on a successful update, 0 is returned if the postgres
    * client can't update the object, -1 is returned if an error occurs
    */
   private async update(): Promise<number>{
      if(this.updatedFields.size == 0)
         return 0;
      const columnNames: Array<string> = [];
      const columnValues: Array<unknown> = [];
      this.updatedFields.forEach(fieldName =>{
         columnNames.push(fieldName);
         columnValues.push(this[fieldName as keyof User]);
      });
      const id = await dbUpdate(this.client, this.tableName, columnNames, columnValues, this.sysId);
      if(id < 1)
         throw new Error('Package could not be updated');
      this.updatedFields.clear();
      return id;
   }

   /**
    * Deletes the User corresponding to this package in the 
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
         throw new Error('New ID is invalid');
      this.sysId = newId;
   }
   /**
    * Gets the username of the user object
    */
   public get username(): string{
      return this.user;
   }

   public set username(newUsername: string){
      if(!newUsername)
         throw new Error('New username is invalid');
      this.user = newUsername;
      this.updatedFields.add('username');
   }

   public get password(): string{
      return this.pass;
   }

   public set password(newPassword: string){
      if(!newPassword)
         throw new Error('New password is invalid');
      this.pass = newPassword;
      this.updatedFields.add('password');
   }

   public get email(): string{
      return this.emailAddress;
   }

   public set email(newEmail: string){
      if(!newEmail)
         throw new Error('New email is invalid');
      this.emailAddress = newEmail;
      this.updatedFields.add('email');
   }

   public get apiKey(): string{
      return this.key;
   }

   public set apiKey(newApiKey: string){
      if(!newApiKey)
         throw new Error('New API key is invalid');
      this.key = newApiKey;
      this.updatedFields.add('apiKey');
   }

   public get profilePicture(): string{
      return this.picture;
   }

   public set profilePicture(newPicture: string){
      if(!newPicture)
         throw new Error('New profile picture URL is invalid');
      this.picture = newPicture;
      this.updatedFields.add('profilePicture');
   }

   public get salt(): string{
      return this.saltData;
   }

   public set salt(newSalt: string){
      if(!newSalt)
         throw new Error('New salt is invalid');
      this.saltData = newSalt;
      this.updatedFields.add('salt');
   }
}
export default User;