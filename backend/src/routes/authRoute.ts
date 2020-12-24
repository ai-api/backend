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
 * Description. Logs the user in by generating
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
}) , (req,res) => {

   console.log(authService.genRefreshToken());



   res.json('TODO: Not yet implemented');
});

/**
 * Description. Logs the user in by generating
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
 * Description. Generates a new JWT for the
 * user, assuming that a valid refreshToken was
 * sent in the body
 */
router.post('/refresh', celebrate({
   [Segments.BODY]: Joi.object().keys({
      refreshToken: Joi.string().token().required(), // TODO: add regex to make sure token is proper len
   }).unknown(),
}), (req,res) => {
   res.json('TODO: Not yet implemented');
});

/**
 * Description. Logs the user out by deleting 
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
   res.json('TODO: Not yet implemented');
});

/**
 * Export the router so we can use it
 * in app.ts
 */
export default router;



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