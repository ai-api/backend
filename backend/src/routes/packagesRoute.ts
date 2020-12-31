import express from 'express';
import { celebrate, Joi, Segments, errors } from 'celebrate';

const router = express.Router();

/**
 * Description. Creates a new package
 * Response:
 * 200 on success and returns @packageId
 * in the body
 * 409 if packageName already exists
 */
router.post('/', celebrate({
   [Segments.BODY]: Joi.object().keys({
      packageName: Joi.string().alphanum().required(),
      category: Joi.string().required(), // TODO: make it only possible to be certain words
      // flags: Joi.object().required(), // TODO: add back flags when functionality exists
      desciption: Joi.string().required(),
      input: Joi.string().required(), 
      output: Joi.string().required()
   }).unknown(),
}), (req,res) => {
   res.json('TODO: Not yet implemented');
});

/**
 * Description. Returns a package based on 
 * @packageId provided as a query param
 * Response:
 * 200 on success
 * 404 if package not found
 */
router.get('/', celebrate({
   [Segments.QUERY]: Joi.object().keys({
      packageId: Joi.number().positive().integer().required()
   }).unknown(),
}), (req,res) => {
   res.json('TODO: Not yet implemented');
});

/**
 * Description. Updates any of the package's 
 * settings
 * Response:
 * 200 on success
 * 403 if user doesn't have permission to 
 * edit package
 * 404 if package not found
 */
router.patch('/', celebrate({
   [Segments.BODY]: Joi.object().keys({
      packageId: Joi.number().positive().integer().required(),
      packageName: Joi.string().alphanum(),
      category: Joi.string(), // TODO: make it only possible to be certain words
      flags: Joi.object(),
      desciption: Joi.string(),
      input: Joi.string(), // TODO: make more strict
      output: Joi.string() // TODO: make more strict
   }).unknown(),
}), (req,res) => {
   res.json('TODO: Not yet implemented');
});


