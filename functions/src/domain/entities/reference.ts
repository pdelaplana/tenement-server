import { Entity } from './entity';

export class Reference<TEntity extends Entity, TId> {
  constructor(private _id: TId) {}

  get id(): TId {
    return this._id;
  }
}
