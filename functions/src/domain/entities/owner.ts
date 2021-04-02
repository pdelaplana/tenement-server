
export interface Owner {
  personId : string;
  isCoOwner: boolean;
  effectiveDate: Date;
  endDate?: Date;
}
