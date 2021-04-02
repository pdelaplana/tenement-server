import { Organization } from '../../domain/entities/organization';
import { Next } from './command-handler';
import { Repository } from '../repository/repository';
import { BaseCommand } from './base-command';
import { Developer } from '../../domain/entities/developer';
import { DeveloperUpdatedEvent } from '../../domain/events/developer-events';
import { ValidationError } from './validation-error';


export interface UpdateDeveloperCommandPayload {
  id : string;
  name : string;
}

const validatePayload = () => {
  return {
    execute: async (payload:UpdateDeveloperCommandPayload, next: Next<DeveloperUpdatedEvent>) => {
      const errors = [];
      if (!payload.name) errors.push('Name is missing');
      if (errors.length > 0) throw new ValidationError('NewDeveloperCommand', errors);
      return next(null);
    },
  };
};

const updateDeveloperCommandHandler = (
    repository: Repository<Developer>
) =>{
  return {
    execute: async (payload:UpdateDeveloperCommandPayload, next: Next<DeveloperUpdatedEvent>) =>{
      let result = null;
      let developer = await repository.get(payload.id);
      if (payload.name) (developer.name = payload.name);
      developer = await repository.update(developer);
      if (developer.id !== undefined) {
        result = <DeveloperUpdatedEvent>{ id: developer.id, developer };
      }
      return await next(result);
    },
  };
};

export class UpdateDeveloperCommand
  extends BaseCommand<UpdateDeveloperCommandPayload, DeveloperUpdatedEvent> {
  constructor(payload: UpdateDeveloperCommandPayload,
      repository: Repository<Organization>) {
    super(
        payload,
        validatePayload(),
        updateDeveloperCommandHandler(repository)
    );
  }
}

