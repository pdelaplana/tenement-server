import { Identifier } from '../entities/identifier';
import { Unit } from '../entities/unit';

export type UnitCreatedEvent = {
  eventType: 'UnitCreatedEvent';
  id: Identifier<string>;
  unit: Unit;
}

export type UnitDeletedEvent = {
  eventType: 'DeveloperDeletedEvent';
  id: Identifier<string>;
}

export type UnitUpdatedEvent = {
  eventType: 'UnitUpdatedEvent';
  id: Identifier<string>;
  unit: Unit;
}
