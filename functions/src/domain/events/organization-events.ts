import { Identifier } from '../entities/identifier';
import { Organization } from '../entities/organization';

export interface OrganizationDeletedEvent {
  id: Identifier<string>;
}

export interface OrganizationUpdatedEvent {
  id: Identifier<string>;
  organization: Organization;
}
