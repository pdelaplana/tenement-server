import * as express from 'express';

export const homeController = (db: FirebaseFirestore.Firestore) => {
  const controller = express();

  controller.get('/', (request, response)=> {
    response.status(200).send('Hello World');
  });

  return controller;
};
