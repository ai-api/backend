import { AuthService } from '../services/subjects/authService';
import express from 'express';

/**
 * These are all of the routes that do not need
 * authentication
 */
const noAuthRoutes = [
   '/users/new',
   '/auth/',
   '/auth/google',
   '/auth/refresh'
];

/**
 * Description. The following function is intended to be used as 
 * middleware within express. It checks if the route requires 
 * authentication. If it does, it grabs the jwt from the header,
 * and formats it properly. If the jwt isn't in the header, a 401
 * status is returned. If the jwt is in the header, we then check 
 * if its autheorized.
 * @param req The current request
 * @param res The current response
 * @param next The next middleware function express will call
 */
export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

   if (noAuthRoutes.includes(req.url)) {
      next();
      return;
   }
   const jwtString = req.headers.authorization;
   const jwt = jwtString?.replace('Bearer ', '');
   if (jwt === undefined) {
      res.status(401).json({
         'Error': 'Invalid Authorization'
      });
      return;
   }
   try {
      req.userId = await AuthService.getInstance().authorize(jwt);
   }
   catch(err) {
      res.status(401).json({
         'Error': 'JWT could not be authenticated'
      });
      return;
   }
   next();
};