import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { restApi } from './restapi/rest-api';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
// const auth = admin.auth();

export const api = functions.https.onRequest(restApi(db));

export const helloWorld2 = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});
