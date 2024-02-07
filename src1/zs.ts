import * as builder from "xmlbuilder";
interface InvoiceLine {
  ID: number;
  InvoicedQuantity: {
    unitCode: string;
    value: number;
  };
  LineExtensionAmount: {
    currencyID: string;
    value: number;
  };
  TaxTotal: {
    TaxAmount: {
      currencyID: string;
      value: number;
    };
    RoundingAmount: {
      currencyID: string;
      value: number;
    };
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
    PriceAmount: {
      currencyID: string;
      value: number;
    };
    AllowanceCharge: {
      ChargeIndicator: boolean;
      AllowanceChargeReason: string;
      Amount: {
        currencyID: string;
        value: number;
      };
    };
  };
}

// Create the data object
const invoiceLine: InvoiceLine = {
  ID: 1,
  InvoicedQuantity: {
    unitCode: "PCE",
    value: 2.0,
  },
  LineExtensionAmount: {
    currencyID: "SAR",
    value: 4.0,
  },
  TaxTotal: {
    TaxAmount: {
      currencyID: "SAR",
      value: 0.6,
    },
    RoundingAmount: {
      currencyID: "SAR",
      value: 4.6,
    },
  },
  Item: {
    Name: "قلم رصاص",
    ClassifiedTaxCategory: {
      ID: "S",
      Percent: 15.0,
      TaxScheme: {
        ID: "VAT",
      },
    },
  },
  Price: {
    PriceAmount: {
      currencyID: "SAR",
      value: 2.0,
    },
    AllowanceCharge: {
      ChargeIndicator: true,
      AllowanceChargeReason: "discount",
      Amount: {
        currencyID: "SAR",
        value: 0.0,
      },
    },
  },
};

// Build the XML
const xml = builder
  .create("cac:InvoiceLine")
  .ele("cbc:ID", invoiceLine.ID)
  .up()
  .ele(
    "cbc:InvoicedQuantity",
    { unitCode: invoiceLine.InvoicedQuantity.unitCode },
    invoiceLine.InvoicedQuantity.value
  )
  .up()
  .ele(
    "cbc:LineExtensionAmount",
    { currencyID: invoiceLine.LineExtensionAmount.currencyID },
    invoiceLine.LineExtensionAmount.value
  )
  .up()
  .ele("cac:TaxTotal")
  .ele(
    "cbc:TaxAmount",
    { currencyID: invoiceLine.TaxTotal.TaxAmount.currencyID },
    invoiceLine.TaxTotal.TaxAmount.value
  )
  .up()
  .ele(
    "cbc:RoundingAmount",
    { currencyID: invoiceLine.TaxTotal.RoundingAmount.currencyID },
    invoiceLine.TaxTotal.RoundingAmount.value
  )
  .up()
  .up()
  .ele("cac:Item")
  .ele("cbc:Name", invoiceLine.Item.Name)
  .up()
  .ele("cac:ClassifiedTaxCategory")
  .ele("cbc:ID", invoiceLine.Item.ClassifiedTaxCategory.ID)
  .up()
  .ele("cbc:Percent", invoiceLine.Item.ClassifiedTaxCategory.Percent)
  .up()
  .ele("cac:TaxScheme")
  .ele("cbc:ID", invoiceLine.Item.ClassifiedTaxCategory.TaxScheme.ID)
  .up()
  .up()
  .up()
  .ele("cac:Price")
  .ele(
    "cbc:PriceAmount",
    { currencyID: invoiceLine.Price.PriceAmount.currencyID },
    invoiceLine.Price.PriceAmount.value
  )
  .up()
  .ele("cac:AllowanceCharge")
  .ele("cbc:ChargeIndicator", invoiceLine.Price.AllowanceCharge.ChargeIndicator)
  .up()
  .ele(
    "cbc:AllowanceChargeReason",
    invoiceLine.Price.AllowanceCharge.AllowanceChargeReason
  )
  .up()
  .ele(
    "cbc:Amount",
    { currencyID: invoiceLine.Price.AllowanceCharge.Amount.currencyID },
    invoiceLine.Price.AllowanceCharge.Amount.value
  )
  .up()
  .up()
  .up()
  .toString({ pretty: true });

console.log(xml);
