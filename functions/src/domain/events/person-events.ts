import { Identifier } from '../entities/identifier';
import { Person } from '../entities/person';

export type PersonCreatedEvent = {
  eventType: 'PersonCreatedEvent';
  id: Identifier<string>;
  person: Person;
}

export interface PersonDeletedEvent {
  eventType: 'PersonDeletedEvent';
  id: Identifier<string>;
}

export type PersonUpdatedEvent = {
  eventType: 'PersonUpdatedEvent';
  id: Identifier<string>;
  person: Person;
}
