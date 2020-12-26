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

export const authMiddleware = async (req: express.Request , res: express.Response, next: express.NextFunction): Promise<void> => {

   /**
    * Check if route requires authentication.
    * If not, just call next() immediately
    */
   if (noAuthRoutes.includes(req.url)) {
      next();
      return;
   }

   /**
    * Grab the jwt from the header, format the jwt properly,
    * and if it doesn't exist, then send status 401 and return
    */
   const jwtString = req.headers.authorization;
   const jwt = jwtString?.replace('Bearer ', '');
   if (jwt === undefined) {
      res.status(401).json({
         'Error': 'Invalid Authorization'
      });
      return;
   }

   /**
    * Check if jwt is valid. If not, return 401 unauthorized
    */
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