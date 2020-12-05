import express from 'express';
import { celebrate, Joi, Segments, errors } from 'celebrate';
const router = express.Router();


router.post('/', celebrate({
   [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      age: Joi.number().integer(),
      role: Joi.string().default('admin')
    }).unknown(),
}) , (req,res) => {
   res.send('Hello World!');
});


/**
 * Export the router so we can use it
 * in app.ts
 */
export default router;