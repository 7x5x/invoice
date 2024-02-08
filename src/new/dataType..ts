import UBLXmlTag from "./UBLTag.js";

export enum MainInvoiceTypes {
  Standard = "1000",
  Simplified = "0100",
  Standard_Simplified = "1100",
}

export enum ZATCAInvoiceTypes {
  INVOICE = "388",
  DEBIT_NOTE = "383",
  CREDIT_NOTE = "381",
}

interface InvoiceType {
  type: ZATCAInvoiceTypes;
  value: MainInvoiceTypes;
  // currencyType: currencyType;
}

enum currencyType {
  SAR = "SAR",
  USD = "USD",
}

export enum ZATCAPaymentMethods {
  CASH = "10",
  CREDIT = "30",
  BANK_ACCOUNT = "42",
  BANK_CARD = "48",
}

// ==================================================
interface UBLTagData {
  invoice_hash: string;
  signed_properties_hash: string;
  digital_signature: string;
  certificate_string: string;
  signed_properties_xml: string;
}

export interface InvoiceInfo {
  ProfileID: string;
  ID: string;
  UUID: string;
  IssueDate: string;
  IssueTime: string;
  DeliveryDate: string;
  PaymentMeans: ZATCAPaymentMethods;
  InvoiceTypeCode: InvoiceType; //{stander or simple and type}
  DocumentCurrencyCode: currencyType;
  TaxCurrencyCode: currencyType;
  InvoiceCounter: string;
  BillingReferenceID?: string;
  previousInvoiceHash: string;
  qr: string;
}

export enum infotype {
  AccountingCustomerParty,
  AccountingSupplierParty,
}
export interface AccountingPartyInfo {
  type: infotype;
  Party: Party;
}

interface Party {
  PartyIdentification: {
    ID: string;
    schemeID: string;
  };
  PostalAddress: PostalAddress;
  PartyTaxScheme: string;
  CompanyID?: string;
  RegistrationName: string;
}

interface PostalAddress {
  StreetName: string;
  BuildingNumber: string;
  PlotIdentification: string;
  CitySubdivisionName: string;
  CityName: string;
  PostalZone: string;
  Country: string;
}
//export
export interface AllowanceCharge {
  ChargeIndicator: boolean;
  AllowanceChargeReason: string;
  Amount: {
    AmountValue: number;
    currencyID: currencyType;
  };
  TaxCategory: {
    id: string;
    Percent: string;
    TaxSchemeID: string;
  };
}
export interface TaxTotal {
  TaxAmount: number;
  TaxSubtotal: {
    TaxableAmount: number;
    TaxAmount: number;
    TaxCategory: {
      ID: number;
      Percent: number;
      TaxSchemeID: number;
    };
  };
}
export interface LegalMonetaryTotal {
  LineExtensionAmount: number;
  TaxExclusiveAmount: number;
  TaxInclusiveAmount: number;
  AllowanceTotalAmount: number;
  PrepaidAmount: number;
  PayableAmount: number;
}
interface InvoiceLine {
  ID: number;
  InvoicedQuantity: number;
  LineExtensionAmount: number;
  TaxTotal: {
    TaxAmount: number;
    RoundingAmount: number;
  };
  Item: {
    Name: string;
    ClassifiedTaxCategory: {
      ID: string;
      Percent: number;
      TaxScheme: {
        ID: string;
      };
    };
  };
  Price: {
    PriceAmount: number;
    AllowanceCharge: {
      ChargeIndicator: boolean;
      AllowanceChargeReason: string;
      Amount: number;
    };
  };
}

export interface Invoice {
  ublTagData: UBLTagData;
  invoiceInfo: InvoiceInfo;
  allowanceCharge: AllowanceCharge;
  legalMonetaryTotal: LegalMonetaryTotal;
  taxTotal: TaxTotal;
  accountingSupplierParty: AccountingPartyInfo;
  accountingCustomerParty: AccountingPartyInfo;
  invoiceLineItem: InvoiceLine[];
  //
  // invoice_counter_number: number;
  invoice_serial_number: string;
  // issue_date: string;
  // issue_time: string;
  // previous_invoice_hash: string;
}

// =======================================================
const allowanceCharge: AllowanceCharge = {
  ChargeIndicator: false,
  AllowanceChargeReason: "discount",
  Amount: {
    AmountValue: 0.0,
    currencyID: currencyType.SAR,
  },
  TaxCategory: {
    id: "S",
    Percent: "15",
    TaxSchemeID: "VAT",
  },
};
const ublTagData: UBLTagData = {
    invoice_hash:
      " YjQwZmEyMjM2NDU1YjQwNjM5MTFmYmVkODc4NjM2NTc0N2E3OGFmZjVlMzA1ODAwYWE5Y2ZmYmFjZjRiNjQxNg==",
    signed_properties_hash: "sample_signed_properties_hash",
    digital_signature: "sample_digital_signature",
    certificate_string: "sample_certificate_string",
    signed_properties_xml: "sample_signed_properties_xml",
  },
  invoiceInfo: InvoiceInfo = {
    ProfileID: "sample_ProfileID",
    ID: "sample_ID",
    UUID: "sample_UUID",
    IssueDate: "sample_IssueDate",
    IssueTime: "sample_IssueTime",
    DeliveryDate: "sample_DeliveryDate",
    previousInvoiceHash: "previousInvoiceHash",
    qr: "qr",
    PaymentMeans: ZATCAPaymentMethods.CASH,
    InvoiceTypeCode: {
      type: ZATCAInvoiceTypes.INVOICE,
      value: MainInvoiceTypes.Standard,
    },
    DocumentCurrencyCode: currencyType.SAR,
    TaxCurrencyCode: currencyType.SAR,
    InvoiceCounter: "sample_InvoiceCounter",
  },
  legalMonetaryTotal: LegalMonetaryTotal = {
    LineExtensionAmount: 100,
    TaxExclusiveAmount: 90,
    TaxInclusiveAmount: 100,
    AllowanceTotalAmount: 10,
    PrepaidAmount: 0,
    PayableAmount: 100,
  },
  taxTotal: TaxTotal = {
    TaxAmount: 10,
    TaxSubtotal: {
      TaxableAmount: 90,
      TaxAmount: 10,
      TaxCategory: {
        ID: 1,
        Percent: 10,
        TaxSchemeID: 1,
      },
    },
  },
  accountingSupplierParty: AccountingPartyInfo = {
    type: infotype.AccountingSupplierParty,
    Party: {
      PartyIdentification: {
        ID: "sample_PartyIdentification",
        schemeID: "sample_schemeID",
      },
      PostalAddress: {
        StreetName: "sample_StreetName",
        BuildingNumber: "sample_BuildingNumber",
        PlotIdentification: "sample_PlotIdentification",
        CitySubdivisionName: "sample_CitySubdivisionName",
        CityName: "sample_CityName",
        PostalZone: "sample_PostalZone",
        Country: "sample_Country",
      },
      PartyTaxScheme: "sample_PartyTaxScheme",
      RegistrationName: "sample_RegistrationName",
    },
  },
  accountingCustomerParty: AccountingPartyInfo = {
    type: infotype.AccountingCustomerParty,
    Party: {
      PartyIdentification: {
        ID: "sample_PartyIdentification",
        schemeID: "sample_schemeID",
      },
      PostalAddress: {
        StreetName: "sample_StreetName",
        BuildingNumber: "sample_BuildingNumber",
        PlotIdentification: "sample_PlotIdentification",
        CitySubdivisionName: "sample_CitySubdivisionName",
        CityName: "sample_CityName",
        PostalZone: "sample_PostalZone",
        Country: "sample_Country",
      },
      PartyTaxScheme: "sample_PartyTaxScheme",
      RegistrationName: "sample_RegistrationName",
    },
  },
  invoiceLineItem: InvoiceLine[] = [
    {
      ID: 1,
      InvoicedQuantity: 10,
      LineExtensionAmount: 100,
      TaxTotal: {
        TaxAmount: 10,
        RoundingAmount: 0,
      },
      Item: {
        Name: "sample_ItemName",
        ClassifiedTaxCategory: {
          ID: "sample_TaxCategoryID",
          Percent: 10,
          TaxScheme: {
            ID: "sample_TaxSchemeID",
          },
        },
      },
      Price: {
        PriceAmount: 10,
        AllowanceCharge: {
          ChargeIndicator: false,
          AllowanceChargeReason: "sample_AllowanceChargeReason",
          Amount: 0,
        },
      },
    },
    {
      ID: 1,
      InvoicedQuantity: 10,
      LineExtensionAmount: 100,
      TaxTotal: {
        TaxAmount: 10,
        RoundingAmount: 0,
      },
      Item: {
        Name: "sample_ItemName",
        ClassifiedTaxCategory: {
          ID: "sample_TaxCategoryID",
          Percent: 10,
          TaxScheme: {
            ID: "sample_TaxSchemeID",
          },
        },
      },
      Price: {
        PriceAmount: 10,
        AllowanceCharge: {
          ChargeIndicator: false,
          AllowanceChargeReason: "sample_AllowanceChargeReason",
          Amount: 0,
        },
      },
    },
    {
      ID: 1,
      InvoicedQuantity: 10,
      LineExtensionAmount: 100,
      TaxTotal: {
        TaxAmount: 10,
        RoundingAmount: 0,
      },
      Item: {
        Name: "sample_ItemName",
        ClassifiedTaxCategory: {
          ID: "sample_TaxCategoryID",
          Percent: 10,
          TaxScheme: {
            ID: "sample_TaxSchemeID",
          },
        },
      },
      Price: {
        PriceAmount: 10,
        AllowanceCharge: {
          ChargeIndicator: false,
          AllowanceChargeReason: "sample_AllowanceChargeReason",
          Amount: 0,
        },
      },
    },
  ];
export const invoice: Invoice = {
  ublTagData: ublTagData,
  invoice_serial_number: "sample_invoice_serial_number",
  invoiceInfo: invoiceInfo,
  accountingCustomerParty: accountingCustomerParty,
  accountingSupplierParty: accountingSupplierParty,
  allowanceCharge: allowanceCharge,
  legalMonetaryTotal: legalMonetaryTotal,
  taxTotal: taxTotal,
  invoiceLineItem,
};

export const sampleInvoiceData: Invoice = {
  ublTagData: {
    invoice_hash: "sample_invoice_hash",
    signed_properties_hash: "sample_signed_properties_hash",
    digital_signature: "sample_digital_signature",
    certificate_string: "sample_certificate_string",
    signed_properties_xml: "sample_signed_properties_xml",
  },
  allowanceCharge: allowanceCharge,
  invoiceInfo: {
    ProfileID: "sample_ProfileID",
    ID: "sample_ID",
    UUID: "sample_UUID",
    IssueDate: "sample_IssueDate",
    IssueTime: "sample_IssueTime",
    DeliveryDate: "sample_DeliveryDate",
    previousInvoiceHash: "previousInvoiceHash",
    qr: "qr",
    PaymentMeans: ZATCAPaymentMethods.CASH,
    InvoiceTypeCode: {
      type: ZATCAInvoiceTypes.INVOICE,
      value: MainInvoiceTypes.Standard,
    },
    DocumentCurrencyCode: currencyType.SAR,
    TaxCurrencyCode: currencyType.SAR,
    InvoiceCounter: "sample_InvoiceCounter",
  },
  legalMonetaryTotal: {
    LineExtensionAmount: 100,
    TaxExclusiveAmount: 90,
    TaxInclusiveAmount: 100,
    AllowanceTotalAmount: 10,
    PrepaidAmount: 0,
    PayableAmount: 100,
  },
  taxTotal: {
    TaxAmount: 10,
    TaxSubtotal: {
      TaxableAmount: 90,
      TaxAmount: 10,
      TaxCategory: {
        ID: 1,
        Percent: 10,
        TaxSchemeID: 1,
      },
    },
  },
  accountingSupplierParty: {
    type: infotype.AccountingSupplierParty,
    Party: {
      PartyIdentification: {
        ID: "sample_PartyIdentification",
        schemeID: "sample_schemeID",
      },
      PostalAddress: {
        StreetName: "sample_StreetName",
        BuildingNumber: "sample_BuildingNumber",
        PlotIdentification: "sample_PlotIdentification",
        CitySubdivisionName: "sample_CitySubdivisionName",
        CityName: "sample_CityName",
        PostalZone: "sample_PostalZone",
        Country: "sample_Country",
      },
      PartyTaxScheme: "sample_PartyTaxScheme",
      RegistrationName: "sample_RegistrationName",
    },
  },
  accountingCustomerParty: {
    type: infotype.AccountingCustomerParty,
    Party: {
      PartyIdentification: {
        ID: "sample_PartyIdentification",
        schemeID: "sample_schemeID",
      },
      PostalAddress: {
        StreetName: "sample_StreetName",
        BuildingNumber: "sample_BuildingNumber",
        PlotIdentification: "sample_PlotIdentification",
        CitySubdivisionName: "sample_CitySubdivisionName",
        CityName: "sample_CityName",
        PostalZone: "sample_PostalZone",
        Country: "sample_Country",
      },
      PartyTaxScheme: "sample_PartyTaxScheme",
      RegistrationName: "sample_RegistrationName",
    },
  },
  invoiceLineItem: [
    {
      ID: 1,
      InvoicedQuantity: 10,
      LineExtensionAmount: 100,
      TaxTotal: {
        TaxAmount: 10,
        RoundingAmount: 0,
      },
      Item: {
        Name: "sample_ItemName",
        ClassifiedTaxCategory: {
          ID: "sample_TaxCategoryID",
          Percent: 10,
          TaxScheme: {
            ID: "sample_TaxSchemeID",
          },
        },
      },
      Price: {
        PriceAmount: 10,
        AllowanceCharge: {
          ChargeIndicator: false,
          AllowanceChargeReason: "sample_AllowanceChargeReason",
          Amount: 0,
        },
      },
    },
    {
      ID: 1,
      InvoicedQuantity: 10,
      LineExtensionAmount: 100,
      TaxTotal: {
        TaxAmount: 10,
        RoundingAmount: 0,
      },
      Item: {
        Name: "sample_ItemName",
        ClassifiedTaxCategory: {
          ID: "sample_TaxCategoryID",
          Percent: 10,
          TaxScheme: {
            ID: "sample_TaxSchemeID",
          },
        },
      },
      Price: {
        PriceAmount: 10,
        AllowanceCharge: {
          ChargeIndicator: false,
          AllowanceChargeReason: "sample_AllowanceChargeReason",
          Amount: 0,
        },
      },
    },
    {
      ID: 1,
      InvoicedQuantity: 10,
      LineExtensionAmount: 100,
      TaxTotal: {
        TaxAmount: 10,
        RoundingAmount: 0,
      },
      Item: {
        Name: "sample_ItemName",
        ClassifiedTaxCategory: {
          ID: "sample_TaxCategoryID",
          Percent: 10,
          TaxScheme: {
            ID: "sample_TaxSchemeID",
          },
        },
      },
      Price: {
        PriceAmount: 10,
        AllowanceCharge: {
          ChargeIndicator: false,
          AllowanceChargeReason: "sample_AllowanceChargeReason",
          Amount: 0,
        },
      },
    },
  ],
  // invoice_counter_number: 1,
  invoice_serial_number: "sample_invoice_serial_number",
  // issue_date: "sample_issue_date",
  // issue_time: "sample_issue_time",
  // previous_invoice_hash: "sample_previous_invoice_hash",
};

// console.log(sampleInvoiceData);
