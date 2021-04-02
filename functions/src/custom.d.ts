import { RepositoryContext } from './application/repository/repository';

declare global {
  namespace Express {
    interface Request {
      context: RepositoryContext,

    }
  }
}
