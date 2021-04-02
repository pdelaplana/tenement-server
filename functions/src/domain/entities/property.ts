import { Address } from '../value-objects/address';
import { PropertyType } from './types';
import { Entity } from './entity';
import { Developer } from './developer';
import { Unit } from './unit';

export interface Property extends Entity {

  name: string;
  propertyType: PropertyType;
  buildingName?: string;
  developer: Developer;
  address: Address;

  units: Unit[];

}
