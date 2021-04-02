import { Request } from 'express';
import * as admin from 'firebase-admin';

export const authHelper = () => {
  return {

    createUser: function(email:string, password:string, displayName:string) {
      return admin.auth().createUser({
        email: email,
        password: password,
        displayName: displayName,
      });
    },

    updateUser: function(uid:string, properties: any) {
      return admin.auth().updateUser(uid, properties);
    },

    decodeToken: function(request: Request) {
      const idToken = request.get('Authorization')?.split('Bearer ')[1] ||'';
      return admin.auth().verifyIdToken(idToken);
    },

    getOrganizationIdFromToken: (async (token: admin.auth.DecodedIdToken, db: FirebaseFirestore.Firestore) => {
      return (await db.collection('userProfiles').doc(token.uid).get()).get('organizationId');
    }),

  };
};
