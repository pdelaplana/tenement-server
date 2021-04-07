import { Person } from '../../domain/entities/person';
import { Gender } from '../../domain/entities/types';
import { PersonCreatedEvent } from '../../domain/events/person-events';
import { Address } from '../../domain/value-objects/address';
import { Repository } from '../repository/repository';
import { BaseCommand } from './base-command';
import { Next } from './command-handler';
import { ValidationError } from './validation-error';

export interface NewPersonCommandPayload {
  firstName: string;
  lastName: string;
  gender?: Gender;
  birthDate?: Date;

  homeAddress?: Address;
  workAddress?: Address;

  primaryPhone?: string;
  homePhone?: string;
  workPhone?: string;
  cellPhone?: string;

  email?: string;
}

const validator = () => {
  return {
    execute: async (payload:NewPersonCommandPayload, next: Next<PersonCreatedEvent>) => {
      const errors = [];
      if (!payload.firstName) errors.push('FirstName is missing');
      if (!payload.lastName) errors.push('LastName is missing');
      if (errors.length > 0) throw new ValidationError('NewPersonCommand', errors);
      return next(null);
    },
  };
};


const commandHandler = (
    personRepository: Repository<Person>
) => {
  return {
    execute: async (payload:NewPersonCommandPayload, next: Next<PersonCreatedEvent>) =>{
      const person = await personRepository.add(
        <Person>{
          firstName: payload.firstName,
          lastName: payload.lastName,
          gender: payload.gender,
          birthDate: payload.birthDate ? new Date(payload.birthDate) : null,
          homeAddress: payload.homeAddress,
          workAddress: payload.workAddress,
          primaryPhone: payload.primaryPhone,
          homePhone: payload.homePhone,
          cellPhone: payload.cellPhone,
          email: payload.email,
        }
      );

      const result = <PersonCreatedEvent>{ id: person.id, person };
      return await next(result);
    },
  };
};

export class NewPersonCommand
  extends BaseCommand<NewPersonCommandPayload, PersonCreatedEvent> {
  constructor(
      payload: NewPersonCommandPayload,
      personRepository: Repository<Person>
  ) {
    super(
        payload,
        validator(),
        commandHandler(personRepository)
    );
  }
}
