import { Next } from './command-handler';
import { Repository } from '../repository/repository';
import { BaseCommand } from './base-command';


import { ValidationError } from './validation-error';
import { UnitUpdatedEvent } from '../../domain/events/unit-events';
import { Unit } from '../../domain/entities/unit';


export interface UpdateUnitCommandPayload {
  id : string;
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
}

const validatePayload = () => {
  return {
    execute: async (payload:UpdateUnitCommandPayload, next: Next<UnitUpdatedEvent>) => {
      const errors = [];
      if (!payload.unitNo) errors.push('UnitNo is missing');
      if (errors.length > 0) throw new ValidationError('UpdateUnitCommand', errors);
      return next(null);
    },
  };
};

const updateUnitCommandHandler = (
    repository: Repository<Unit>
) =>{
  return {
    execute: async (payload:UpdateUnitCommandPayload, next: Next<UnitUpdatedEvent>) =>{
      let result = null;
      let unit = await repository.get(payload.id);
      unit.unitNo = payload.unitNo || unit.unitNo;
      unit.floorLevel = payload.floorLevel || unit.floorLevel;
      unit.modelName = payload.modelName || unit.modelName;
      unit.squareArea = payload.squareArea || unit.squareArea;
      unit.bedroomCount = payload.bedroomCount || unit.bedroomCount;
      unit.bathroomCount = payload.bathroomCount || unit.bathroomCount;
      unit.floorPlan = payload.floorPlan || unit.floorPlan;
      unit.hasBalcony = payload.hasBalcony || unit.hasBalcony;
      unit.balconyArea = payload.balconyArea || unit.balconyArea;
      unit.description = payload.description || unit.description;

      console.debug('mapped object', JSON.stringify(unit));
      unit = await repository.update(unit);
      if (unit.id !== undefined) {
        result = <UnitUpdatedEvent>{ id: unit.id, unit };
      }
      return await next(result);
    },
  };
};

export class UpdateUnitCommand
  extends BaseCommand<UpdateUnitCommandPayload, UnitUpdatedEvent> {
  constructor(payload: UpdateUnitCommandPayload,
      repository: Repository<Unit>) {
    super(
        payload,
        validatePayload(),
        updateUnitCommandHandler(repository)
    );
  }
}

