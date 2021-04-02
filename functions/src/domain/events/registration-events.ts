import { Identifier } from '../entities/identifier';
import { Organization } from '../entities/organization';


export interface NewRegistrationEvent {
  name: string;
  email: string;
  password: string;
  organization: string;
}

export interface CompletedRegistrationEvent {
  uid: string;
  organization: Organization;
}

export interface DeleteRegistrationEvent {
  organizationId: Identifier<string>;
}

export interface DeleteRegistrationCompletedEvent {
  uid: string;
}
