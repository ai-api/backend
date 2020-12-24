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

   ///////////////////////////////////////////////////////////////////////////
   /////////////////////////// CONSTRUCTOR METHODS ///////////////////////////
   ///////////////////////////////////////////////////////////////////////////

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

   ///////////////////////////////////////////////////////////////////////////
   ///////////////////////////// PUBLIC METHODS //////////////////////////////
   ///////////////////////////////////////////////////////////////////////////

   /**
    * Description. If username and password are valid, will generate,
    * store, and return a refresh token that can then be used to 
    * authenticate the user. If either username, or password are invalid,
    * will throw an error with the appropriate message
    * @param username the user's username
    * @param password the user's password
    */
   public async login(username: string, password: string): Promise<string> {

      /**
       * Grab user based on username.
       * If username doesn't exist, 
       * throw error
       */
      const user = users.get(username);
      if (!user) {
         this.notify('loginFail', user);
         throw new Error('Invalid Username');
      }
   
      /**
       * Check if valid password. If not,
       * throw error
       */
      if (user.password != password) {
         this.notify('loginFail', user);
         throw new Error('Invalid Password');
      }
   
      /**
       * If username & password are both
       * correct, generate & store refresh
       * token and return it
       */
      const refreshToken = this.genRefreshToken();
      refreshTokens.set(refreshToken, user.id);
      return refreshToken;
   }

   public async refresh(token: string): string {


      
   }


   ///////////////////////////////////////////////////////////////////////////
   ///////////////////////// PRIVATE HELPER METHODS //////////////////////////
   ///////////////////////////////////////////////////////////////////////////

   /**
    * Description. Generates a string intended to be used as the
    * value that will be returned to the user
    * @return {string} Returns a string encoded in hex with length
    * of 128 that contains 64 bytes of random bytes (1 byte = 2 chars
    * in hex)
    */
   private genRefreshToken(): string {
      return crypto.randomBytes(64).toString('hex');
   }
}

/////////////////////////////////////////////
/////////////// TEMP/TESTING ////////////////
/////////////////////////////////////////////
const users = new Map<string, any>();
const user = {
   id: 1,
   name: 'user',
   password: 'Password1'
};
users.set(user.name, user);

const refreshTokens = new Map<string, number>();