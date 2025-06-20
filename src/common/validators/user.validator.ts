import Joi from 'joi'
import { validationMiddleware } from "../middleware/validation";

export const Validator = {
  signup: () =>
    validationMiddleware({
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid("INDIVIDUAL", "COACH", "FACILITY").required(),
        full_name: Joi.string().required(),
      },
    }),
  login: () =>
    validationMiddleware({
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
    }),

  getUserById: () =>
    validationMiddleware({
      params: {
        id: Joi.string().required(),
      },
    }),
  createUser: () =>
    validationMiddleware({
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid("INDIVIDUAL", "COACH", "FACILITY").required(),
        full_name: Joi.string().required(),
      },
    }),
  updateUserById: () =>
    validationMiddleware({
      params: {
        id: Joi.string().required(),
      },
    }),
};