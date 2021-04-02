
import * as express from 'express';
import { to } from '../../application/helpers';
import { RepositoryContext } from '../../application/repository/repository';


export const buildContext = (db: FirebaseFirestore.Firestore) => {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    if (response.locals.uid) {
      const profile = await db.collection('userProfiles').doc(response.locals.uid).get();
      request.context = to<RepositoryContext>({
        organizationId: profile.get('organizationId'),
        uid: response.locals.uid,
      });
    }
    next();
  };
};
