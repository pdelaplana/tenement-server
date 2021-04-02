import { Entity } from '../../domain/entities/entity';

export interface DataProvider<Db> {
  name: string
  provider: Db
}

export class RepositoryContext {
  uid!: string;
  organizationId!: string;
}

export type QueryOperator =
  '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in'


export interface QueryParameter {
  name: string;
  operator: QueryOperator;
  value: any;
}


export interface Repository<T extends Entity>{
  context: RepositoryContext;
  get: (id: string) => Promise<T>;
  add: (entity: T, id?: string) => Promise<T>;
  update: (entity: T) => Promise<T>;
  delete: (id: string) => Promise<boolean>;
  query: (queryParams: QueryParameter[]) => Promise<T[]>
}
