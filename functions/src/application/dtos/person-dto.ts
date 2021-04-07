import { Person } from '../../domain/entities/person';

export const personDTO = (person:Person) => {
  return {
    id: person.id?.toString(),
    firstName: person.firstName,
    lastName: person.lastName,
    gender: person.gender,
    birthDate: person.birthDate,
    homeAddress: person.homeAddress,
    workAddress: person.workAddress,
    primaryPhone: person.primaryPhone,
    homePhone: person.homePhone,
    workPhone: person.workPhone,
    cellPhone: person.cellPhone,
    email: person.email,
    audit: person.audit,
  };
};
