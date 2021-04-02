import * as admin from 'firebase-admin';
import { to } from '../../application/helpers';
import { UserService, User } from '../../application/services/user-service';

export class FirebaseUserService implements UserService<User> {
  async createUser(email: string, password: string, name: string) {
    return admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    }).then((user) => {
      console.debug('[CREATED] User ', JSON.stringify(user));
      return to<User>({
        uid: user.uid,
        name: user.displayName ? user.displayName : '',
        email: user.email ? user.email : '',
      });
    });
  }
}
