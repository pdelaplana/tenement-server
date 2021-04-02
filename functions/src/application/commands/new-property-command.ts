import { Developer } from '../../domain/entities/developer';
import { Property } from '../../domain/entities/property';
import { PropertyType } from '../../domain/entities/types';
import { PropertyCreatedEvent } from '../../domain/events/property-events';
import { Address } from '../../domain/value-objects/address';
import { QueryParameter, Repository } from '../repository/repository';
import { BaseCommand } from './base-command';
import { Next } from './command-handler';
import { ValidationError } from './validation-error';

export interface NewPropertyCommandPayload {
  name: string;
  propertyType: PropertyType;
  buildingName?: string;
  address: Address;
  developer: {
    name:string;
    address:Address;
  }
}

const validatePayload = () => {
  return {
    execute: async (payload:NewPropertyCommandPayload, next: Next<PropertyCreatedEvent>) => {
      const errors = [];
      if (!payload.name) errors.push('Name is missing');
      if (!payload.propertyType) errors.push('PropertyType is missing');

      if (errors.length > 0) throw new ValidationError('NewPropertyCommand', errors);
      return next(null);
    },
  };
};


export const createNewPropertyCommandHandler = (
    propertyRepository: Repository<Property>,
    developerRepository: Repository<Developer>
) => {
  return {
    execute: async (payload:NewPropertyCommandPayload, next: Next<PropertyCreatedEvent>) =>{
      const filter = [];
      filter.push(<QueryParameter>({ name: 'name', operator: '==', value: payload.developer.name }));

      const developers = await developerRepository.query(filter);
      let developer = (developers.length) ? developers[0] : undefined;
      if (developer == undefined) {
        developer = await developerRepository.add(
          <Developer>{
            name: payload.developer.name,
          }
        );
      }

      const property = await propertyRepository.add(
        <Property>{
          name: payload.name,
          propertyType: payload.propertyType,
          buildingName: payload.buildingName ?? '',
          address: payload.address,
          developer: developer,
        }
      );

      const result = <PropertyCreatedEvent>{ id: property.id, property: property };
      return await next(result);
    },
  };
};

export class NewPropertyCommand
  extends BaseCommand<NewPropertyCommandPayload, PropertyCreatedEvent> {
  constructor(
      payload: NewPropertyCommandPayload,
      propertyRepository: Repository<Property>,
      developerRepository: Repository<Developer>
  ) {
    super(
        payload,
        validatePayload(),
        createNewPropertyCommandHandler(propertyRepository, developerRepository)
    );
  }
}
