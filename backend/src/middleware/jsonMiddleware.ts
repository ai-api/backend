import express from 'express';

/**
 * Just a middleware to set the content type to json for all requests
 * so that we don't have to manually do it
 * @param req The current request
 * @param res The current response
 * @param next The next middleware function express will call
 */
export default (req: express.Request, res: express.Response,
   next: express.NextFunction): void => {
   res.header('Content-Type','application/json');
   next();
};