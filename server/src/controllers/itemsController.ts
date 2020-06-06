import { Request, Response } from 'express';
import knex from '../database/connection';

interface Items {
  id: number;
  title: string;
  image: string;
}

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map((item: Items) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.168.0.110:3333/uploads/${item.image}`,
      };
    });
    return response.json(serializedItems);
  }
}

export default ItemsController;
