import { Organization } from '../../domain/entities/organization';
import { Next } from './command-handler';
import { to } from '../helpers';
import { Repository } from '../repository/repository';
import { OrganizationDeletedEvent } from '../../domain/events/organization-events';
import { Identifier } from '../../domain/entities/identifier';
import { BaseCommand } from './base-command';


export interface DeleteOrganizationCommandPayload {
  id : string;
}

export const deleteOrganizationCommandHandler = (
    repository: Repository<Organization>
) =>{
  return {
    execute: async (payload:DeleteOrganizationCommandPayload, next: Next<OrganizationDeletedEvent>) =>{
      let result;
      if (await repository.delete(payload.id)) {
        result = to<OrganizationDeletedEvent>({ id: new Identifier<string>(payload.id) });
      } else {
        result = null;
      }
      return await next(result);
    },
  };
};

export class DeleteOrganizationCommand
  extends BaseCommand<DeleteOrganizationCommandPayload, OrganizationDeletedEvent> {
  constructor(payload: DeleteOrganizationCommandPayload,
      repository: Repository<Organization>) {
    super(
        payload,
        deleteOrganizationCommandHandler(repository)
    );
  }
}

