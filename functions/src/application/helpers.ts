import { Address } from '../domain/value-objects/address';

export function to<T>(value: T): T {
  return value;
}

export function map<T>(source:T, destination:T) {
  if (source) destination = source;
}

export function mapAddress(source: Address | undefined, target: Address | undefined) {
  if (source) {
    if (target) {
      target.streetAddress1 = source.streetAddress1 || target.streetAddress1;
      target.streetAddress2 = source.streetAddress2 || target.streetAddress2;
      target.streetAddress3 = source.streetAddress3 || target.streetAddress3;
      target.unit = source.unit || target.unit;
      target.city = source.city || target.city;
      target.locality = source.locality || target.locality;
      target.postCode = source.postCode || target.postCode;
      target.country = source.country || target.country;
    } else {
      target = source;
    }
  }
  return target;
}

export function mapDate(source: Date|undefined, target: Date|undefined) {
  return source ? new Date(source) : ((source === null) ? undefined : target);
}
