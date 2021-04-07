import { Address } from '../value-objects/address';
import { Entity } from './entity';
import { Gender } from './types';

export interface Person extends Entity {

  firstName: string;
  lastName: string;
  gender?: Gender;
  birthDate?: Date;

  homeAddress?: Address;
  workAddress?: Address;

  primaryPhone?: string;
  homePhone?: string;
  workPhone?: string;
  cellPhone?: string;

  email?: string;
}
