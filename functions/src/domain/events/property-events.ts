import { Identifier } from '../entities/identifier';
import { Property } from '../entities/property';

export type PropertyCreatedEvent = {
  eventType: 'PropertyCreatedEvent'
  id: Identifier<string>;
  property: Property;
}

export type PropertyDeletedEvent = {
  eventType: 'PropertyDeletedEvent';
  id: Identifier<string>;
}

export type PropertyUpdatedEvent = {
  eventType: 'PropertyUpdateEvent'
  id: Identifier<string>;
  property: Property;
}

