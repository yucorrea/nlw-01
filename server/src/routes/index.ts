import express from 'express';
import { resolve } from 'path';
import { errors } from 'celebrate';

import cors from 'cors';

import itemsRouter from './items.route';
import pointsRouter from './points.route';

const routes = express();

routes.use(cors());
routes.use(express.json());
routes.use('/uploads', express.static(resolve(__dirname, '..', '..', 'tmp')));

routes.use('/items', itemsRouter);
routes.use('/points', pointsRouter);

routes.use(errors());

export default routes;
