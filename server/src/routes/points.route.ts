import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';
import multerConfig from '../config/multer';

import PointController from '../controllers/pointsController';

const pointsRouter = Router();
const upload = multer(multerConfig);

const pointController = new PointController();

pointsRouter.post(
  '/',
  upload.single('image'),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    },
  ),
  pointController.create,
);

pointsRouter.get('/', pointController.index);

pointsRouter.get('/:id', pointController.show);

export default pointsRouter;
