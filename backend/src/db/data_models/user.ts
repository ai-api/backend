import { PoolClient } from 'pg';
import {dbCreate, dbReadById, dbUpdate, dbRemove} from '../dbOperations';
import TableNames from '../enums/tableNames';

class User {
   private sysId: number;
   private user: string;
   private pass: string;
   private emailAddress: string;
   private key: string;
   private profilePicture: string;
   private client: PoolClient;
   private updatedFields: Set<string>;
   private tableName: string;
   private constructor(client: PoolClient, username: string, password: string, email: string, apiKey: string, id: number, profilePicture: string){
      this.client = client;
      this.user = username;
      this.pass = password;
      this.emailAddress = email;
      this.key = apiKey;
      this.sysId = id;
      this.profilePicture = profilePicture;
      this.updatedFields = new Set();
      this.tableName = TableNames.USER;
   }

   public static async getInstance(client: PoolClient, id: number): Promise<User>{
      const data = await dbReadById(client, TableNames.USER, id);
      if(data)
         return new User(client, data.username, data.password, data.email, data.apikey, data.id, data.profilepicture);
      throw new Error('User information could not be retrieved from database');
   }

   public static createInstance(client: PoolClient, username: string, password: string, email: string, apiKey: string, profilePicture = ''): User{
      if(client && username && password && email && apiKey)
         return new User(client, username, password, email, apiKey, -1, profilePicture);
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
      if(this.sysId >= 1)
         return await this.update();
      return await this.create();
   }
   /**
    * Creates a new User entry in the User table using
    * the fields in the current object
    * @return A promise which resolves to a number. The User ID
    * is returned on a successful insert, 0 is returned if the postgres
    * client can't insert the object, -1 is returned if an error occurs
    */
   private async create(): Promise<number>{
      console.log('CREATING NEW USER');
      const columnNames: Array<string> = ['username', 'password','email','apiKey', 'profilePicture'];
      const columnValues: Array<unknown> = [ this.user, this.pass, this.emailAddress, this.key, this.profilePicture];
      return await dbCreate(this.client, this.tableName, columnNames, columnValues);
   }

   /**
    * Updates an existing User entry in the database using the 
    * altered fields in the current object
    * @return A promise which resolves to a number. The User ID
    * is returned on a successful update, 0 is returned if the postgres
    * client can't update the object, -1 is returned if an error occurs
    */
   private async update(): Promise<number>{
      console.log('UPDATING EXISTING PACKAGE');
      if(this.updatedFields.size == 0)
         return 0;
      const columnNames: Array<string> = [];
      const columnValues: Array<unknown> = [];
      this.updatedFields.forEach(fieldName =>{
         columnNames.push(fieldName);
         columnValues.push(this[fieldName as keyof User]);
      });
      return await dbUpdate(this.client, this.tableName, columnNames, columnValues, this.sysId);
   }

   /**
    * Deletes the User corresponding to this package in the 
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
}
// id SERIAL PRIMARY KEY,
// username varchar NOT NULL,
// password varchar NOT NULL,
// email varchar NOT NULL,
// apiKey varchar NOT NULL,
// profilePicture varchar
export default User;