
import { Address } from '../value-objects/address';
import { Gender } from './types';

export interface Person {

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
