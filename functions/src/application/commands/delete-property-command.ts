
import { Next } from './command-handler';

import { Repository } from '../repository/repository';

import { Identifier } from '../../domain/entities/identifier';
import { BaseCommand } from './base-command';
import { Property } from '../../domain/entities/property';
import { PropertyDeletedEvent } from '../../domain/events/property-events';


export interface DeletePropertyCommandPayload {
  id : string;
}

const deletePropertyCommandHandler = (
    repository: Repository<Property>
) =>{
  return {
    execute: async (payload:DeletePropertyCommandPayload, next: Next<PropertyDeletedEvent>) =>{
      let result;
      if (await repository.delete(payload.id)) {
        result = <PropertyDeletedEvent>{ id: new Identifier<string>(payload.id) };
      } else {
        result = null;
      }
      return await next(result);
    },
  };
};

export class DeletePropertyCommand
  extends BaseCommand<DeletePropertyCommandPayload, PropertyDeletedEvent> {
  constructor(payload: DeletePropertyCommandPayload,
      repository: Repository<Property>) {
    super(
        payload,
        deletePropertyCommandHandler(repository)
    );
  }
}

