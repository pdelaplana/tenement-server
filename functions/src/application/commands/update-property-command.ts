import { Next } from './command-handler';
import { QueryParameter, Repository } from '../repository/repository';
import { BaseCommand } from './base-command';
import { PropertyUpdatedEvent } from '../../domain/events/property-events';
import { PropertyType } from '../../domain/entities/types';
import { Property } from '../../domain/entities/property';
import { Address } from '../../domain/value-objects/address';
import { Developer } from '../../domain/entities/developer';

export interface UpdatePropertyCommandPayload {
  id : string;
  name : string;
  buildingName: string;
  propertyType: PropertyType;
  developer: { id: string, name: string };
  address: Address;
}

const updatePropertyCommandHandler = (
    propertyRepository: Repository<Property>,
    developerRepository: Repository<Developer>
) => {
  return {
    execute: async (payload:UpdatePropertyCommandPayload, next: Next<PropertyUpdatedEvent>) =>{
      let result = null;
      let property = await propertyRepository.get(payload.id);
      if (property == null) throw new Error('property not found');

      let developer = null;
      if (payload.developer) {
        if (payload.developer.id) {
          developer = await developerRepository.get(payload.developer.id);
        } else if (payload.developer.name) {
          const filter = [];
          filter.push(<QueryParameter>({ name: 'name', operator: '==', value: payload.developer.name }));
          const developers = await developerRepository.query(filter);
          developer = (developers.length) ? developers[0] : undefined;
        }
        if (!developer) {
          // TODO: create a developer document
        }
      }

      if (payload.name) (property.name = payload.name);
      if (payload.propertyType) (property.propertyType = payload.propertyType);
      if (payload.buildingName) (property.buildingName = payload.buildingName);
      if (payload.address) {
        if (payload.address.streetAddress1) (property.address.streetAddress1 = payload.address.streetAddress1);
        if (payload.address.streetAddress2) (property.address.streetAddress2 = payload.address.streetAddress2);
        if (payload.address.streetAddress3) (property.address.streetAddress3 = payload.address.streetAddress3);
        if (payload.address.locality) (property.address.locality = payload.address.locality);
        if (payload.address.postCode) (property.address.postCode = payload.address.postCode);
        if (payload.address.city) (property.address.city = payload.address.city);
        if (payload.address.country) (property.address.country = payload.address.country);
      }
      if (developer) (property.developer = developer);

      property = await propertyRepository.update(property);
      if (property.id !== undefined) {
        result = <PropertyUpdatedEvent>{ id: property.id, property };
      } else {
        throw new Error('property not updated');
      }
      return await next(result);
    },
  };
};

export class UpdatePropertyCommand
  extends BaseCommand<UpdatePropertyCommandPayload, PropertyUpdatedEvent> {
  constructor(
      payload: UpdatePropertyCommandPayload,
      propertyRepository: Repository<Property>,
      developerRepository: Repository<Developer>
  ) {
    super(
        payload,
        updatePropertyCommandHandler(propertyRepository, developerRepository)
    );
  }
}
