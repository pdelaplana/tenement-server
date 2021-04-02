import { Organization } from '../../domain/entities/organization';
import { CompletedRegistrationEvent } from '../../domain/events/registration-events';
import { Repository } from '../repository/repository';
import { User, UserService } from '../services/user-service';
import { Next } from './command-handler';

export interface NewRegistrationCommandPayload {
  name: string;
  email: string;
  password: string;
  organization: string;
}

export const newRegistrationCommandHandler = (
    repository: Repository<Organization>,
    userService: UserService<User>
) => {
  return {
    execute: async (payload:NewRegistrationCommandPayload, next: Next<CompletedRegistrationEvent>) => {
      return await userService.createUser(payload!.email, payload!.password, payload!.name).then(async (user) =>{
        if (user) {
          // create the organization
          const organization = await repository.add(
            <Organization>{
              name: payload.organization,
            }
          );
          console.debug('[CREATED] Organization', JSON.stringify(organization));
          const result = <CompletedRegistrationEvent>{ uid: user.uid, organization: organization };
          return await next(result);
        } else {
          throw new Error('User not created');
        }
      });
    },
  };
};


