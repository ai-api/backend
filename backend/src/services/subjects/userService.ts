import { Subject } from './subject';
import bcrypt from 'bcrypt';
import DbPool from '../../db/pool';
import User from '../../models/dataModels/user';
import { HttpError } from '../../models/httpModels/httpError';
import { HttpUser } from '../../models/httpModels/httpUser';

const tempSalt = '$2b$10$5S0PrImnVSdekmeLKZLfae';

/**
 * Description. This class container all functions that relate
 * to performing any CRUD operations on a user. It follows both
 * the singleton design pattern, and is also a subject that other
 * classes/objects can subscribe to 
 */
export class UserService extends Subject {

   /**
    * @instance stores the glocal instance of the userService
    */
   private static instance: UserService;
   ///////////////////////////////////////////////////////////////////////////
   /////////////////////////// CONSTRUCTOR METHODS ///////////////////////////
   ///////////////////////////////////////////////////////////////////////////

   /**
    * The constructor is private so that no one accidentally
    * calls a new reference to the UserService. Instead, call
    * UserService.getInstance() 
    */
   private constructor() {
      /**
       * @userEvents are all of the valid events 
       * that the UserService Subject can invoke. Other
       * classes/objects can subscribe to 'listen' for 
       * them
       */
      const userEvents = [
         'create',
         'get',
         'update',
         'delete'
      ];
      super(userEvents);
   }

   /**
    * Description. Will return the instance of the UserService 
    * if it already exists. If it doesn't exist, will create a
    * new instance and return that
    */
   public static getInstance(): UserService {
      if (!UserService.instance) {
         UserService.instance = new UserService();
      }
      return UserService.instance;
   }
   ///////////////////////////////////////////////////////////////////////////
   ///////////////////////////// PUBLIC METHODS //////////////////////////////
   ///////////////////////////////////////////////////////////////////////////

   public async create(username: string, password: string, email: string): Promise<void> {


      
      const { hashedPwd, salt } = await this.hashPassword(password);


      this.notify('create', {});
   }



   ///////////////////////////////////////////////////////////////////////////
   ///////////////////////// PRIVATE HELPER METHODS //////////////////////////
   ///////////////////////////////////////////////////////////////////////////

   /**
    * Hashes a password
    * @param pwd The password you wish to hash
    */
   private async hashPassword(pwd: string): Promise<{hashedPwd: Promise<string>, salt: string}> {

      //const salt = await bcrypt.genSalt(); // TODO: add back after database model has salt
      const salt = tempSalt;
      return {
         hashedPwd: bcrypt.hash(pwd, salt),
         salt: salt
      };
   }

   // private genAPIKey(): string {


   // }

}