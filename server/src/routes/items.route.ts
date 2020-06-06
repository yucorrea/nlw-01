import { Router } from 'express';

import ItemsController from '../controllers/itemsController';

const itemsRouter = Router();
const itemsController = new ItemsController();

itemsRouter.get('/', itemsController.index);

export default itemsRouter;
