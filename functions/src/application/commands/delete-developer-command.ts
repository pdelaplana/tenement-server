import { Next } from './command-handler';
import { Repository } from '../repository/repository';
import { Identifier } from '../../domain/entities/identifier';
import { BaseCommand } from './base-command';
import { Developer } from '../../domain/entities/developer';
import { DeveloperDeletedEvent } from '../../domain/events/developer-events';


export interface DeleteDeveloperCommandPayload {
  id : string;
}

const deleteDeveloperCommandHandler = (
    repository: Repository<Developer>
) =>{
  return {
    execute: async (payload:DeleteDeveloperCommandPayload, next: Next<DeveloperDeletedEvent>) =>{
      let result = null;
      if (await repository.delete(payload.id)) {
        result =<DeveloperDeletedEvent>{ id: new Identifier<string>(payload.id) };
      }
      return await next(result);
    },
  };
};

export class DeleteDeveloperCommand
  extends BaseCommand<DeleteDeveloperCommandPayload, DeveloperDeletedEvent> {
  constructor(payload: DeleteDeveloperCommandPayload,
      repository: Repository<Developer>) {
    super(
        payload,
        deleteDeveloperCommandHandler(repository)
    );
  }
}

