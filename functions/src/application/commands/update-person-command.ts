import { Next } from './command-handler';
import { Repository } from '../repository/repository';
import { BaseCommand } from './base-command';
import { ValidationError } from './validation-error';
import { PersonUpdatedEvent } from '../../domain/events/person-events';
import { Person } from '../../domain/entities/person';
import { Gender } from '../../domain/entities/types';
import { Address } from '../../domain/value-objects/address';
import { mapAddress, mapDate } from '../helpers';


export interface UpdatePersonCommandPayload {
  id : string;
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
    execute: async (payload:UpdatePersonCommandPayload, next: Next<PersonUpdatedEvent>) => {
      const errors = [];
      if (!payload.id) errors.push('Id is missing');
      if (!payload.firstName) errors.push('FirstName is missing');
      if (!payload.lastName) errors.push('LastName is missing');
      if (errors.length > 0) throw new ValidationError('UpdatePersonCommand', errors);
      return next(null);
    },
  };
};

const commandHandler = (
    repository: Repository<Person>
) => {
  return {
    execute: async (payload:UpdatePersonCommandPayload, next: Next<PersonUpdatedEvent>) =>{
      let result = null;
      let person = await repository.get(payload.id);
      person.firstName = payload.firstName || person.firstName;
      person.lastName = payload.lastName || person.lastName;
      person.gender = payload.gender || person.gender;
      person.birthDate = mapDate(payload.birthDate, person.birthDate);
      person.homeAddress = mapAddress(payload.homeAddress, person.workAddress);
      person.workAddress = mapAddress(payload.workAddress, person.workAddress);
      person.primaryPhone = payload.primaryPhone || person.primaryPhone;
      person.cellPhone = payload.cellPhone || person.cellPhone;
      person.workPhone = payload.workPhone || person.workPhone;
      person.email = payload.email || person.email;

      person = await repository.update(person);
      if (person.id !== undefined) {
        result = <PersonUpdatedEvent>{ id: person.id, person };
      }
      return await next(result);
    },
  };
};

export class UpdatePersonCommand
  extends BaseCommand<UpdatePersonCommandPayload, PersonUpdatedEvent> {
  constructor(payload: UpdatePersonCommandPayload,
      repository: Repository<Person>) {
    super(
        payload,
        validator(),
        commandHandler(repository)
    );
  }
}

