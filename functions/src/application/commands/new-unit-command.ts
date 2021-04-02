import { Unit } from '../../domain/entities/unit';
import { UnitCreatedEvent } from '../../domain/events/unit-events';
import { Repository } from '../repository/repository';
import { BaseCommand } from './base-command';
import { Next } from './command-handler';
import { ValidationError } from './validation-error';

export interface NewUnitCommandPayload {
  unitNo: string;
  floorLevel: string;

  modelName?: string;
  squareArea?: number;
  bedroomCount?: number;
  bathroomCount?: number;
  floorPlan?: string;

  hasBalcony: boolean;
  balconyArea?: number

  description?: string;

  // owners?: Owner[];
  // tenants?: Tenant[];
}

const validatePayload = () => {
  return {
    execute: async (payload:NewUnitCommandPayload, next: Next<UnitCreatedEvent>) => {
      const errors = [];
      if (!payload.unitNo) errors.push('Unit No is missing');
      if (!payload.floorLevel) errors.push('FloorLevel is missing');

      if (errors.length > 0) throw new ValidationError('NewUnitCommand', errors);
      return next(null);
    },
  };
};


const newUnitCommandHandler = (
    unitRepository: Repository<Unit>
) => {
  return {
    execute: async (payload:NewUnitCommandPayload, next: Next<UnitCreatedEvent>) =>{
      const unit = await unitRepository.add(
        <Unit>{
          unitNo: payload.unitNo,
          floorLevel: payload.floorLevel,
          description: payload.description || '',
          floorPlan: payload.floorPlan,
          bedroomCount: payload.bedroomCount || 1,
          bathroomCount: payload.bathroomCount || 1,
          hasBalcony: payload.hasBalcony,
          balconyArea: payload.balconyArea,
        }
      );

      const result = <UnitCreatedEvent>{ id: unit.id, unit };
      return await next(result);
    },
  };
};

export class NewUnitCommand
  extends BaseCommand<NewUnitCommandPayload, UnitCreatedEvent> {
  constructor(
      payload: NewUnitCommandPayload,
      unitRepository: Repository<Unit>
  ) {
    super(
        payload,
        validatePayload(),
        newUnitCommandHandler(unitRepository)
    );
  }
}
