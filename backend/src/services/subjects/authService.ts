import { Subject } from './subject';
import crypto  from 'crypto';
/**
 * Description. This class contains all functions that relate to
 * authorizing users. It follows both the singleton design pattern,
 * and is also a subject that other classes/objects can subscribe to
 */
export class AuthService extends Subject {

   /**
    * @instance stores the glocal instance of the userService
    */
   private static instance: AuthService;

   /**
    * The constructor is private so that no one accidentally
    * calls a new reference to the AuthService. Instead, call
    * UserService.getInstance() 
    */
   private constructor() {

      /**
       * @authEvents are all of the valid events 
       * that the AuthService Subject can invoke. Other
       * classes/objects can subscribe to 'listen' for 
       * them
       */
      const authEvents = [
         'loginSuccess',
         'loginFail',
         'refreshSuccess',
         'refreshFail',
         'logoutSuccess',
         'logoutFail'
      ];
      super(authEvents);
   }


   /**
    * Description. Generates a string intended to be used as the
    * value that will be returned to the user
    * @return {string} Returns a string encoded in hex with length
    * of 128 that contains 32 bytes of random bytes (1 byte = 2 chars
    * in hex)
    */
   public genRefreshToken(): string {
      return crypto.randomBytes(64).toString('hex');
   }

   /**
    * Description. Will return the instance of the UserService 
    * if it already exists. If it doesn't exist, will create a
    * new instance and return that
    */
   public static getInstance(): AuthService {
      if (!AuthService.instance) {
         AuthService.instance = new AuthService();
      }
      return AuthService.instance;
   }
}