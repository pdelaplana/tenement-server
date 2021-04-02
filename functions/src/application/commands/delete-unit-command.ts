import { Next } from './command-handler';
import { Repository } from '../repository/repository';
import { Identifier } from '../../domain/entities/identifier';
import { BaseCommand } from './base-command';
import { DeveloperDeletedEvent } from '../../domain/events/developer-events';
import { UnitDeletedEvent } from '../../domain/events/unit-events';
import { Unit } from '../../domain/entities/unit';


export interface DeleteUnitCommandPayload {
  id : string;
}

const deleteHandler = (
    repository: Repository<Unit>
) =>{
  return {
    execute: async (payload:DeleteUnitCommandPayload, next: Next<UnitDeletedEvent>) =>{
      let result = null;
      if (await repository.delete(payload.id)) {
        result =<UnitDeletedEvent>{ id: new Identifier<string>(payload.id) };
      }
      return await next(result);
    },
  };
};

export class DeleteUnitCommand
  extends BaseCommand<DeleteUnitCommandPayload, DeveloperDeletedEvent> {
  constructor(payload: DeleteUnitCommandPayload,
      repository: Repository<Unit>) {
    super(
        payload,
        deleteHandler(repository)
    );
  }
}

