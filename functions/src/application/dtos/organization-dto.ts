import { Organization } from '../../domain/entities/organization';

export const organizationDTO = (organization:Organization) => {
  return {
    id: organization.id?.toString(),
    name: organization.name,
    audit: organization.audit,
  };
};
