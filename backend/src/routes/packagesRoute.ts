import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { PackageService } from '../services/subjects/packageService';
import { HttpError } from '../models/httpModels/httpError';
import { HttpPackage } from '../models/httpModels/httpPackage';
///////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONFIG //////////////////////////////////
///////////////////////////////////////////////////////////////////////////

const router = express.Router();
const packageService = PackageService.getInstance();
///////////////////////////////////////////////////////////////////////////
///////////////////////////////// ROUTES //////////////////////////////////
///////////////////////////////////////////////////////////////////////////

/**
 * Creates a new package
 * Response:
 *  - 201 on success and returns the package. The response also has the
 *    location header as per REST rules
 *  - 409 if packageName already exists
 */
router.post('/', celebrate({
   [Segments.BODY]: Joi.object().keys({
      name: Joi.string().alphanum().required(),
      category: Joi.string().required(), // TODO: make it only possible to be certain words
      // flags: Joi.object().required(), // TODO: add back flags when functionality exists
      description: Joi.string().required(),
      input: Joi.string().required(), 
      output: Joi.string().required(),
      markdown: Joi.string().required()
   }).unknown(),
}), (req,res) => {
   const packageName = req.body.name;
   const category = req.body.category;
   const description = req.body.description;
   const input = req.body.input;
   const output = req.body.output;
   const md = req.body.markdown;
   const userId = req.userId;
   packageService.create(userId, packageName, category, description,
      input, output, md)
      .then((newPackage: HttpPackage) => {
         /* Set the location header to be restful */
         console.log(newPackage.statusCode);
         res.location('/packages/' + newPackage.id);
         res.status(newPackage.statusCode).send(newPackage.format());
      })
      .catch((err: HttpError) => {
         res.status(err.statusCode).send(err.format);
      });
});

/**
 * Returns a package based on 
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
   const packageId = Number(req.query.packageId);
   packageService.read(packageId)
      .then((foundPackage: HttpPackage) => {
         res.status(foundPackage.statusCode).send(foundPackage.format());
      })
      .catch((err: HttpError) => {
         res.status(err.statusCode).send(err.format());
      });
   
});

/**
 * Updates any of the package's 
 * settings
 * Response:
 * 200 on success
 * 403 if user doesn't have permission to 
 * edit package
 * 404 if package not found
 */
router.patch('/', celebrate({
   [Segments.QUERY]: Joi.object().keys({
      packageId: Joi.number().positive().integer().required()
   }).unknown(),
   [Segments.BODY]: Joi.object().keys({
      packageName: Joi.string().alphanum(),
      category: Joi.string(), // TODO: make it only possible to be certain words
      flags: Joi.object(),
      desciption: Joi.string(),
      input: Joi.string(), // TODO: make more strict
      output: Joi.string() // TODO: make more strict
   }).unknown(),
}), (req,res) => {
   const packageId = Number(req.query.packageId);
   const packageName = req.body.name;
   const category = req.body.category;
   const description = req.body.description;
   const input = req.body.input;
   const output = req.body.output;
   const md = req.body.markdown;
   const userId = req.userId;

   packageService.update(packageId, userId, packageName, category,
      description, input, output, md)
      .then((updatedPack: HttpPackage) => {
         res.status(updatedPack.statusCode).send(updatedPack.format());
      })
      .catch((err: HttpError) => {
         res.status(err.statusCode).send(err.format);
      });
});

/**
 * Export the router so we can use it
 * in app.ts
 */
export default router;