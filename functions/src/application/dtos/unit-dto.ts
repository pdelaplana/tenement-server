import { Unit } from '../../domain/entities/unit';

export const unitDTO = (unit:Unit) => {
  return {

    id: unit.id?.toString(),
    unitNo: unit.unitNo,
    floorLevel: unit.floorLevel,
    modelName: unit.modelName,
    squareArea: unit.squareArea,
    bedroomCount: unit.bedroomCount,
    bathroomCount: unit.bathroomCount,
    floorPlan: unit.floorPlan,
    hasBalcony: unit.hasBalcony,
    balconyArea: unit.balconyArea,
    description: unit.description,
    audit: unit.audit,

  };
};
