export class Identifier<T> {
  constructor(private _id: T) {}

  equals(id?: Identifier<T>): boolean {
    if (this._id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this._id;
  }

  set id(value: T) {
    this._id = value;
  }

  hasValue() : boolean {
    return this._id !== null && this._id !== undefined;
  }

  toString() {
    return String(this._id);
  }

  toValue(): T {
    return this._id;
  }
}
