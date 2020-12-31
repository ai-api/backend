import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import regexTokens from '../config/regexTokens';
import { AuthService } from '../services/subjects/authService';

/////////////////////////////////////////////
////////////////// CONFIG ///////////////////
/////////////////////////////////////////////

const router = express.Router();
const authService = AuthService.getInstance();
/////////////////////////////////////////////
////////////////// ROUTES ///////////////////
/////////////////////////////////////////////

/**
 * Logs the user in by generating
 * a refresh token, and returning it in the
 * response
 * Response:
 * 200 OK on success, returns a refreshToken
 * 401 Auth Failed if incorrect pass/login
 * 
 */
router.post('/', celebrate({
   [Segments.BODY]: Joi.object().keys({
      username: Joi.string().regex(regexTokens.username).required(),
      password: Joi.string().regex(regexTokens.password).required()
   }).unknown(), 
}) ,(req,res) => {
   const username = req.body.username;
   const password = req.body.password;
  
   authService.login(username, password)
      .then((refreshToken) => {
         res.status(200).json({
            'refreshToken': refreshToken
         });
      })
      .catch((err) => {
         res.status(401).json({
            'Error': err.message
         });
      });
});

/**
 * Logs the user in by generating
 * a refresh token, and returning it in the
 * response
 */
router.post('/google', celebrate({
   [Segments.BODY]: Joi.object().keys({
      idToken: Joi.string().required()
   }).unknown(),
}), (req,res) => {
   res.json('TODO: Not yet implemented');
});

/**
 * Generates a new JWT for the
 * user, assuming that a valid refreshToken was
 * sent in the body
 */
router.post('/refresh', celebrate({
   [Segments.BODY]: Joi.object().keys({
      refreshToken: Joi.string().token().required(), // TODO: add regex to make sure token is proper len
   }).unknown(),
}), async (req,res) => {
   const refreshToken = req.body.refreshToken;
   authService.refresh(refreshToken)
      .then((jwt: string) => {
         res.status(200).json({
            'jwt': jwt
         });
      })
      .catch((err: Error) => {
         res.status(401).json({
            'Error': err.message
         });
         return;
      });
});

/**
 * Logs the user out by deleting 
 * the refresh token from the server. Important
 * to note that the last JWT the user grabbed 
 * will still be valid until it times out
 */
router.delete('/', celebrate({
   [Segments.BODY]: Joi.object().keys({
      refreshToken: Joi.string().token().required(), // TODO: add regex to make sure token is proper len
      global: Joi.bool().optional()
   }).unknown(),
}), (req,res) => {

   const refreshToken = req.body.refreshToken;
   const global = req.body.global;
   const userId = req.userId;
   authService.logout(userId, refreshToken, global)
      .then(() => {
         res.status(200).send();
      })
      .catch((err) => {
         res.status(500).json({
            'Error': err.message
         });
      });
 
});


/**
 * Export the router so we can use it
 * in app.ts
 */
export default router;


