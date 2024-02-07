import fs from "fs";

export enum ZATCAInvoiceTypes {
  INVOICE = "388",
  DEBIT_NOTE = "383",
  CREDIT_NOTE = "381",
}

export type InvoiceLineItem = {
  id: string;
  name: string;
  quantity: number;
  tax_exclusive_price: number;
};

export type Location = {
  StreetName: string;
  BuildingNumber: string;
  PlotIdentification?: string; // Optional
  CitySubdivisionName?: string; // Optional
  CityName: string;
  PostalZone: string;
};

export type SupplierInfo = {
  id: string;
  CRN: string;
  location: Location;
};

export type invoice = {
  id: string;
};
