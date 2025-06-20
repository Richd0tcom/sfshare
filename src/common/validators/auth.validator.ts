import Joi from 'joi'
import { validationMiddleware } from "../middleware/validation";

export const AuthValidator = {
  signup: () =>
    validationMiddleware({
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid("admin", "manager", "employee").required(),
      },
    }),
  login: () =>
    validationMiddleware({
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
    }),

};