
export interface Tenant {
  personId : string;
  isPrimary: boolean;
  startDate: Date;
  endDate?: Date;
}
