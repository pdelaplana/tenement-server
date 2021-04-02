
import * as express from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (request: express.Request, res: express.Response, next: express.NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(request)));

    const errors = validationResult(request);
    if (errors.isEmpty()) {
      next();
    } else {
      res.status(422).json({ errors: errors.array() });
    }
  };
};

export const validateObject = <T>(validations: ValidationChain[]) => {
  return async (request: express.Request, res: express.Response, next: express.NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(request)));

    const errors = validationResult(request);
    if (errors.isEmpty()) {
      const payload: T = request.body;
      express.response.locals = payload;
      next();
    } else {
      res.status(422).json({ errors: errors.array() });
    }
  };
};
