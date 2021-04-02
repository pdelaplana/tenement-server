import { Property } from '../../domain/entities/property';

export const propertyDTO = (property:Property) => {
  return {
    id: property.id?.toString(),
    name: property.name,
    developer: property.developer,
    propertyType: property.propertyType,
    buildingName: property.buildingName,
    address: property.address,
    audit: property.audit,
  };
};
