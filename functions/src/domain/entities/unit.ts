import { Entity } from './entity';
import { Owner } from './owner';
import { Tenant } from './tenant';

export interface Unit extends Entity{
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

  owners?: Owner[];
  tenants?: Tenant[];
}
