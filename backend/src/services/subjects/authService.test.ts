
import HttpError from '../../models/httpModels/httpError';
import { AuthService } from './authService';

const authService = AuthService.getInstance();

describe('login', () => {

   /* Test logging in with valid credentials */
   test('valid credentials', () => {
      authService.login('user', 'Password1').then((refreshToken) => {

         /* Make sure the token is 128 chars long */
         expect(refreshToken.length).toBe(128);

         /* Test if refreshToken is hex */
         const hex = /[0-9A-Fa-f]{6}/g;
         expect(hex.test(refreshToken)).toBe(true);
      });
   });

   /* Test logging in with invalid username */
   test('invalid username', () => {
      authService.login('wrongUsername', 'Password1').then(() => {
         /* If test ever gets here, fail */
         expect(false).toBe(true);
      })
      .catch((err: HttpError) => {
         expect(err).toBeInstanceOf(HttpError);
         expect(err).toHaveProperty('message', 'Invalid Username');
         expect(err).toHaveProperty('statusCode', 401);
      });
   });

   /* Test logging in with missing username */
   test('invalid username', () => {
      authService.login('', 'Password1').then(() => {
         /* If test ever gets here, fail */
         expect(false).toBe(true);
      })
      .catch((err: HttpError) => {
         expect(err).toBeInstanceOf(HttpError);
         expect(err).toHaveProperty('message', 'Invalid Username');
         expect(err).toHaveProperty('statusCode', 401);
      });
   });

   /* Test logging in with missing password */
   test('invalid username', () => {
      authService.login('user', '').then(() => {
         /* If test ever gets here, fail */
         expect(false).toBe(true);
      })
      .catch((err: HttpError) => {
         expect(err).toBeInstanceOf(HttpError);
         expect(err).toHaveProperty('message', 'Invalid Password');
         expect(err).toHaveProperty('statusCode', 401);
      });
   });

   /* Test logging in with invalid password */
   test('invalid password', () => {
      authService.login('user', 'wrongPassword').then(() => {
         /* If test ever gets here, fail */
         expect(false).toBe(true);
      })
      .catch((err: HttpError) => {
         expect(err).toBeInstanceOf(HttpError);
         expect(err).toHaveProperty('message', 'Invalid Password');
         expect(err).toHaveProperty('statusCode', 401);
      });
   });
});


describe('authorize', () => {

   test('valid refresh token', () => {
      /* Test generating a JWT with valid credentials */
      authService.login('user', 'Password1').then((refreshToken) => {
         authService.refresh(refreshToken).then((jwt) => {
            /* Make sure its a string */
            expect(typeof jwt).toBe('string');
         });
      });
   });

   test('invalid refresh token', () => {
      authService.refresh('').then(() => {
         /* If test ever gets here, fail */
         expect(false).toBe(true);
      })
      .catch((err) => {
         expect(err).toBeInstanceOf(HttpError);
         expect(err).toHaveProperty('message', 'Refresh Token not found on server');
         expect(err).toHaveProperty('statusCode', 401);
      });
   });



});