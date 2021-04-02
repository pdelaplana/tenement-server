import { Developer } from '../entities/developer';
import { Identifier } from '../entities/identifier';

export type DeveloperCreatedEvent = {
  eventType: 'DeveloperCreatedEvent';
  id: Identifier<string>;
  developer: Developer;
}

export interface DeveloperDeletedEvent {
  eventType: 'DeveloperDeletedEvent';
  id: Identifier<string>;
}

export type DeveloperUpdatedEvent = {
  eventType: 'DeveloperUpdatedEvent';
  id: Identifier<string>;
  developer: Developer;
}
