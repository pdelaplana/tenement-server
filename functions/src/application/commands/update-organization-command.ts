import { Organization } from '../../domain/entities/organization';
import { Next } from './command-handler';
import { to } from '../helpers';
import { Repository } from '../repository/repository';
import { OrganizationUpdatedEvent } from '../../domain/events/organization-events';
import { BaseCommand } from './base-command';


export interface UpdateOrganizationCommandPayload {
  id : string;
  name : string;
}

/*
export class UpdateOrganizationCommandHandler implements CommandHandler<UpdateOrganizationCommandPayload, OrganizationUpdatedEvent> {
  constructor(private repository: Repository<Organization>) {
  }
  execute = async (command: UpdateOrganizationCommandPayload, next: Next<OrganizationUpdatedEvent>)
    : Promise<OrganizationUpdatedEvent | null> => {
    let result = null;
    let organization = await this.repository.get(command.id);
    if (command.name) (organization.name = command.name);
    organization = await this.repository.update(organization);
    if (organization.id !== undefined) {
      result = to<OrganizationUpdatedEvent>({ id: organization.id, organization });
    }
    return await next(result);
  }
}
*/

export const updateOrganizationCommandHandler = (
    repository: Repository<Organization>
) =>{
  return {
    execute: async (command:UpdateOrganizationCommandPayload, next: Next<OrganizationUpdatedEvent>) =>{
      let result = null;
      let organization = await repository.get(command.id);
      if (command.name) (organization.name = command.name);
      organization = await repository.update(organization);
      if (organization.id !== undefined) {
        result = to<OrganizationUpdatedEvent>({ id: organization.id, organization });
      }
      return await next(result);
    },
  };
};

export class UpdateOrganizationCommand
  extends BaseCommand<UpdateOrganizationCommandPayload, OrganizationUpdatedEvent> {
  constructor(payload: UpdateOrganizationCommandPayload,
      repository: Repository<Organization>) {
    super(
        payload,
        updateOrganizationCommandHandler(repository)
    );
  }
}


export const createUpdateOrganizationCommand = (
    payload: UpdateOrganizationCommandPayload,
    repository: Repository<Organization>
) =>{
  return new BaseCommand<UpdateOrganizationCommandPayload, OrganizationUpdatedEvent>(
      payload,
      updateOrganizationCommandHandler(repository)
  );
};
