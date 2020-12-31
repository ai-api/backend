import { Subject } from './subject';
import crypto  from 'crypto';
import fs from 'fs';
import generateSecret from 'jose/util/generate_secret';
import fromKeyLike, { JWK } from 'jose/jwk/from_key_like';
import parseJwk from 'jose/jwk/parse';
import EncryptJWT from 'jose/jwt/encrypt';
import jwtDecrypt from 'jose/jwt/decrypt';
import config from '../../config/config';

/**
 * Description. This class contains all functions that relate to
 * authorizing users. It follows both the singleton design pattern,
 * and is also a subject that other classes/objects can subscribe to
 */
export class AuthService extends Subject {

   /**
    * @instance stores the global instance of the userService
    * @jwk is the current jwk that encrypts and authorizes all
    * jwt's
    */
   private static instance: AuthService;
   private jwk!: JWK;
   ///////////////////////////////////////////////////////////////////////////
   /////////////////////////// CONSTRUCTOR METHODS ///////////////////////////
   ///////////////////////////////////////////////////////////////////////////

   /**
    * The constructor is private so that no one accidentally
    * calls a new reference to the AuthService. Instead, call
    * UserService.getInstance()
    */
   private constructor() {
      super(authEvents);
      this.genJwk();
   }

   /**
    * Will return the instance of the UserService 
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
    * Validates a jwt, and returns the user's userId
    * if it is valid
    * @param jwt The user's jwt
    */
   public async authorize(jwt: string): Promise<number> {

      const { payload,  } = await jwtDecrypt(jwt, await parseJwk(this.jwk), {
         issuer: config.auth.iss,
         audience: config.auth.aud
      });
      return payload.userId;
   }

   /**
    * If username and password are valid, will generate,
    * store, and return a refresh token that can then be used to 
    * authenticate the user. If either username, or password are invalid,
    * will throw an error with the appropriate message
    * @param username the user's username
    * @param password the user's password
    */
   public async login(username: string, password: string): Promise<string> {

      const user = users.get(username);
      if (!user) {
         this.notify('loginFail', user);
         throw new Error('Invalid Username');
      }
      if (user.password != password) {
         this.notify('loginFail', user);
         throw new Error('Invalid Password');
      }
      const refreshToken = this.genRefreshToken();
      refreshTokens.set(refreshToken, user.id);
      return refreshToken;
   }

   /**
    * Will try to delete refresh token from the database. If refresh
    * token does not exist, will throw an error with the appropriate
    * message
    * TODO: Allow users to be logged out globally
    * 
    * @param userId The user's id
    * @param token The user's refresh token
    * @param global True if the user wishes to log out from all devices
    */
   public async logout(userId: number, token: string, global: boolean): Promise<void> {

      if (refreshTokens.get(token) != userId) {
         throw new Error('Refresh Token does not correspond to this user');
      }

      if (!refreshTokens.delete(token)) {
         //this.notify('logoutFail', )
         throw new Error('Refresh Token not found on server');
      }
   }

   /**
    * Will check if a refresh token is valid, and if it
    * is, will return a valid jwt. Otherwise, it will throw an error
    * with the appropriate message
    * @param token The user's refresh token
    */
   public async refresh(token: string): Promise<string> {

      const userId = refreshTokens.get(token);
      if (userId == undefined) {
         this.notify('refreshFail', user); // TODO: Properly grab user object
         throw new Error('Refresh Token not found on server');
      }

      const payload = {
         'userId': userId
      };
      const jwt = await new EncryptJWT(payload)
         .setProtectedHeader({
            alg: config.auth.alg, 
            enc: config.auth.enc
         })
         .setIssuedAt()
         .setIssuer(config.auth.iss)
         .setAudience(config.auth.aud)
         .setExpirationTime('2h')
         .encrypt(await parseJwk(this.jwk));

      this.notify('refreshSuccess', user); // TODO: Properly grab user object
      return jwt;
   }

   ///////////////////////////////////////////////////////////////////////////
   ///////////////////////// PRIVATE HELPER METHODS //////////////////////////
   ///////////////////////////////////////////////////////////////////////////

   /**
    * Generates a string intended to be used as the
    * value that will be returned to the user
    * @return {string} Returns a string encoded in hex with length
    * of 128 that contains 64 bytes of random bytes (1 byte = 2 chars
    * in hex)
    */
   private genRefreshToken(): string {
      return crypto.randomBytes(64).toString('hex');
   }

   /**
    * Checks if the file jwk.json exists
    * in /src/config/ and if not, generates the file.
    * Then, sets this.jwk to the contents of jwk.json
    */
   private async genJwk(): Promise<void> {
      let jwk: JWK;

      if (fs.existsSync(__dirname + '/../../config/jwk.json')) {
         jwk = JSON.parse(fs.readFileSync(__dirname + '/../../config/jwk.json').toString());
      } 
      else {
         const secret = await generateSecret('A256GCM');
         jwk = await fromKeyLike(secret);
         jwk.kid = 'Auth Key';
         jwk.alg = config.auth.alg;
         jwk.use = 'enc';
         fs.writeFileSync(__dirname + '/../../config/jwk.json', JSON.stringify(jwk));
      }
      this.jwk = jwk;
   }
}

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
