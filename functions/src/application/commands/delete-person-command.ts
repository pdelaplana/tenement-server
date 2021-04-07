import { Next } from './command-handler';
import { Repository } from '../repository/repository';
import { Identifier } from '../../domain/entities/identifier';
import { BaseCommand } from './base-command';
import { Person } from '../../domain/entities/person';
import { PersonDeletedEvent } from '../../domain/events/person-events';


export interface DeletePersonCommandPayload {
  id : string;
}

const commandHandler = (
    repository: Repository<Person>
) =>{
  return {
    execute: async (payload:DeletePersonCommandPayload, next: Next<PersonDeletedEvent>) =>{
      let result;
      if (await repository.delete(payload.id)) {
        result = <PersonDeletedEvent>{ id: new Identifier<string>(payload.id) };
      } else {
        result = null;
      }
      return await next(result);
    },
  };
};

export class DeletePersonCommand
  extends BaseCommand<DeletePersonCommandPayload, PersonDeletedEvent> {
  constructor(payload: DeletePersonCommandPayload,
      repository: Repository<Person>) {
    super(
        payload,
        commandHandler(repository)
    );
  }
}

