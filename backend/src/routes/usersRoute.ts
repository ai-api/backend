import express from 'express';
import { celebrate, Joi, Segments, errors } from 'celebrate';
import regexTokens from '../config/regexTokens';

const router = express.Router();

/**
 * Description. Creates a new user
 * Response:
 * 200 on success
 * 409 if username or email already exists
 */
router.post('/', celebrate({
   [Segments.BODY]: Joi.object().keys({
      /**
       * usernames must:
       * 1. Be 3-20 chars long
       * 2. no _ or . at beginning
       * 3. no __ or _. or .. inside
       * 4. [a-zA-Z0-9._] are all allowed chars
       * 5. no _ or . at the end
       */
      username: Joi.string().regex(regexTokens.username).required(),
      password: Joi.string().regex(regexTokens.password).required(),
      email: Joi.string().email().required()
   }).unknown(),
   }), (req,res) => {
   res.json('TODO: Not yet implemented');
});

/**
 * Description. Returns a user based on
 * @userId provided as a query param
 * Response:
 * 200 OK if success
 * 403 If user doesn't have permission to
 * view the user provided by @userId
 * 404 if user does not exist  
 */
router.get('/', celebrate({
   [Segments.QUERY]: Joi.object().keys({
      userId: Joi.number().positive().integer().required()
   }).unknown(), 
   }), (req,res) => {
   res.json('TODO: Not yet implemented');
});

/**
 * Description. Updates any of the user's 
 * settings
 * Response:
 * 200 OK on success
 * 403 if user doesn't have permission to
 * edit the user provided by @userId
 */
router.patch('/', celebrate({
   [Segments.BODY]: Joi.object().keys({
      userId: Joi.number().positive().integer().required(),
      username: Joi.string().alphanum(),
      password: Joi.string(),
      email: Joi.string().email(),
   }).unknown(), 
   }), (req,res) => {
   res.json('TODO: Not yet implemented');
});

/**
 * Description. Deletes a user based on
 * @userId
 * Response:
 * 200 OK if success
 * 403 If user doesn't have permission to
 * delete the user provided by @userId  
 */
router.delete('/', celebrate({
   [Segments.QUERY]: Joi.object().keys({
      userId: Joi.number().positive().integer().required()
   }).unknown(), 
   }), (req,res) => {
   res.json('TODO: Not yet implemented');
});

/**
 * Export the router so we can use it
 * in app.ts
 */
export default router;