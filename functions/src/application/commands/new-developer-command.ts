import { Developer } from '../../domain/entities/developer';
import { DeveloperCreatedEvent } from '../../domain/events/developer-events';
import { Repository } from '../repository/repository';
import { BaseCommand } from './base-command';
import { Next } from './command-handler';
import { ValidationError } from './validation-error';

export interface NewDeveloperCommandPayload {
  name: string;
}

export const validatePayload = () => {
  return {
    execute: async (payload:NewDeveloperCommandPayload, next: Next<DeveloperCreatedEvent>) => {
      const errors = [];
      if (!payload.name) errors.push('Name is missing');
      if (errors.length > 0) throw new ValidationError('NewDeveloperCommand', errors);
      return next(null);
    },
  };
};

export const createNewDeveloperCommandHandler = (
    developerRepository: Repository<Developer>
) => {
  return {
    execute: async (payload:NewDeveloperCommandPayload, next: Next<DeveloperCreatedEvent>) =>{
      const developer = await developerRepository.add(
          <Developer>{
            name: payload.name,
          }
      );

      const result = <DeveloperCreatedEvent>{ id: developer.id, developer: developer };
      return await next(result);
    },
  };
};

export class NewDeveloperCommand
  extends BaseCommand<NewDeveloperCommandPayload, DeveloperCreatedEvent> {
  constructor(
      payload: NewDeveloperCommandPayload,
      developerRepository: Repository<Developer>
  ) {
    super(
        payload,
        validatePayload(),
        createNewDeveloperCommandHandler(developerRepository)
    );
  }
}
