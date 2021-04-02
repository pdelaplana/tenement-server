import { Audit } from '../value-objects/audit';
import { Identifier } from './identifier';


export interface Entity {
  id?: Identifier<string>;
  audit?: Audit;
  version: number;
}

export const entityBuilder = <T>(id:string, data: any) => {
  return {
    id: new Identifier<string>(id),
    ...data,
    audit: {
      createdByUid: data.audit.createdByUid,
      createdDate: data.audit.createdDate.toDate(),
      lastUpdatedByUid: data.audit.lastUpdatedByUid,
      lastUpdatedDate: data.audit.lastUpdatedDate.toDate(),
    } } as T;
};


