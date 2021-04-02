import { authHelper } from '../../infrastructure/auth/auth-helper';
import * as express from 'express';

export const authenticate = () => {
  return (request: express.Request, response: express.Response, next: express.NextFunction) => {
    authHelper().decodeToken(request).then(async (token) =>{
      response.locals.uid = token.uid;
      next();
    }).catch((error)=> {
      response.status(401).send(error);
    });
  };
};
