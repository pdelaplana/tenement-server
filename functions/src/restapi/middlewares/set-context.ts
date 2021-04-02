
import * as express from 'express';
import { RepositoryFactory } from '../../dependency-factory';

export const setContext = (repositoryFactory: RepositoryFactory) => {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    if (request.context) repositoryFactory.currentContext = request.context;
    next();
  };
};
