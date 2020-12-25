import { Subject } from './subject';
import crypto  from 'crypto';
import fs from 'fs';
import generateSecret from 'jose/util/generate_secret';
import fromKeyLike from 'jose/jwk/from_key_like';
import parseJwk from 'jose/jwk/parse';
import CompactEncrypt from 'jose/jwe/compact/encrypt';
import compactDecrypt from 'jose/jwe/compact/decrypt';

import config from '../../config/config';

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

      /**
       * Generate the secret key that all JWT's
       * will be signed and verified with
       */
      this.genSecretKey();
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

   public async refresh(token: string): Promise<string> {

      const user = refreshTokens.get(token);

      if (user == undefined) {
         throw new Error('Refresh Token not found on server');
      }

      return 'test';
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

   private async genSecretKey(): Promise<void> {

      /**
       * If the secret.key file already exists and is 
       * valid, don't do anything and just return
       */
      if (fs.existsSync(__dirname + '/../../config/jwk.json')) { //TODO, check correct directory
         return;
      }
      const secret = await generateSecret('A256GCM');

      /**
       * Create a jwk and store it on a file
       */
      const jwk = await fromKeyLike(secret);
      jwk.alg = config.auth.alg;
      jwk.use = 'enc';
      fs.writeFileSync(__dirname + '/../../config/jwk.json', JSON.stringify(jwk));

      // // /**
      // //  * TESTING
      // //  */
      // const privateKey = fs.readFileSync(__dirname + '/../../config/jwk.json');

      // const encoder = new TextEncoder();
      // const payload = {
      //    'userid': 1
      // };

      // const jwe = await new CompactEncrypt(encoder.encode(JSON.stringify(payload)))
      // .setProtectedHeader({
      //    alg: 'A256KW', 
      //    enc: 'A256GCM'
      // })
      // .encrypt(await parseJwk(jwk, 'dir'));
      // console.log(jwe);
      // const { plaintext, protectedHeader} = await compactDecrypt(jwe, await parseJwk(jwk, 'A256KW'));

      // const decoder = new TextDecoder();
      // console.log(protectedHeader);
      // console.log(decoder.decode(plaintext));
     

    
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