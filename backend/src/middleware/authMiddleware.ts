import { AuthService } from '../services/subjects/authService';
import express from 'express';

/**
 * These are all of the routes that do not need
 * authentication
 */
const noAuthRoutes = [
   {
      url: '/users',
      method: 'POST'
   },
   {
      url: '/auth',
      method: 'POST'
   },
   {
      url: '/auth/google',
      method: 'POST'
   },
   {
      url: '/auth/refresh',
      method: 'POST'
   }
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
export default async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
   
   if (noAuthRoutes.some((route) => req.url == route.url && req.method == route.method)) {
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