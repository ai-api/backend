import { PoolClient } from 'pg';
import {dbCreate, dbReadById, dbUpdate, dbRemove} from '../dbOperations';
import TableNames from '../enums/tableNames';

class User {
   private sys_id: number;
   private user: string;
   private pass: string;
   private emailAddress: string;
   private key: string;
   private profilePicture: string;
   private client: PoolClient;
   private updatedFields: Set<string>;
   private constructor(client: PoolClient, username: string, password: string, email: string, apiKey: string, id: number, profilePicture: string){
      this.client = client;
      this.user = username;
      this.pass = password;
      this.emailAddress = email;
      this.key = apiKey;
      this.sys_id = id;
      this.profilePicture = profilePicture;
      this.updatedFields = new Set();
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
}
// id SERIAL PRIMARY KEY,
// username varchar NOT NULL,
// password varchar NOT NULL,
// email varchar NOT NULL,
// apiKey varchar NOT NULL,
// profilePicture varchar
export default User;