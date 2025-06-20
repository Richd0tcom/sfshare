import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../../utils/error';

export interface RequestEntity {
    body?: any;
    params?: any;
    headers?: any;
    query?: any;
}



const validateObject = (object = {}, label: string, schema: any, options?: Joi.ValidationOptions) => {
  if (schema) {
    const { error, value } = Joi.object(schema).validate(object, options);
    if (error) {
      throw new Error(`${error.message.replace(/"/g, '')}`);
    }
  }
};

export const validationMiddleware = (validationObj:RequestEntity) => (req: Request, res: Response , next: NextFunction) => {
  try {
    validateObject(req.headers, 'Headers', validationObj.headers, {
      allowUnknown: true,
    });
    validateObject(req.params, 'URL Parameters', validationObj.params);
    validateObject(req.query, 'URL Query', validationObj.query);

    if (req.body) {
      console.log("Logging request body: ");
      console.log(JSON.parse(JSON.stringify(req.body)))
      validateObject(req.body, 'Request Body', validationObj.body);
    }

   next();
  } catch (err:any) {
     throw new BaseError(err.message, 'Bad Request', 400);
  }
};