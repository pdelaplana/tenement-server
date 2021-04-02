export interface Address{
    streetAddress1: string;
    streetAddress2?: string;
    streetAddress3?: string;
    unit?: string;
    locality: string;
    city: string;
    postCode: string;
    country?: string;
}
