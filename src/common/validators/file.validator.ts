import Joi from 'joi'
import { validationMiddleware } from "../middleware/validation";

export const Validator = {
  upload: () =>
    validationMiddleware({
      body: {
        tags: Joi.array(),
        metadata: Joi.object(),
        permissionLevel: Joi.string().valid('private', 'shared', 'public'),
      },
    }),
  getfiles: () =>
    validationMiddleware({
      query: {
        page: Joi.number().min(1),
        limit: Joi.number().min(1).max(5),
        search: Joi.string(),
        permissionLevel: Joi.string().valid('private', 'shared', 'public'),
        tags: Joi.string(),

      }
    }),

  getFileById: () =>
    validationMiddleware({
      params: {
        id: Joi.string().required(),
      },
    }),
  updateFile: () =>
    validationMiddleware({
      params: {
        id: Joi.string().required(),
      },
      body: {
        tags: Joi.array(),
        metadata: Joi.object(),
        permissionLevel: Joi.string().valid('private', 'shared', 'public'),
      },
    }),

};