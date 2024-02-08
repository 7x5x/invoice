import * as builder from "xmlbuilder";

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

export function generateInvoiceLineXML(invoiceLineList: InvoiceLine[]) {
  var te: any;
  var line:string='';
  const xmlInvoiceLineList: any[] = [];
  invoiceLineList.forEach((invoiceLine) => {
    const xmlinvoiceLine = builder.create("cac:InvoiceLine");

    xmlinvoiceLine
      .ele("cbc:ID", {}, invoiceLine.ID.toString())
      .up()
      .ele("cbc:InvoicedQuantity", { unitCode: "PCE" })
      .txt(invoiceLine.InvoicedQuantity.toFixed(6))
      .up()
      .ele(
        "cbc:LineExtensionAmount",
        { currencyID: "SAR" },
        invoiceLine.LineExtensionAmount.toFixed(2)
      )
      .up()
      .ele("cac:TaxTotal")
      .ele(
        "cbc:TaxAmount",
        { currencyID: "SAR" },
        invoiceLine.TaxTotal.TaxAmount.toFixed(2)
      )
      .up()
      .ele(
        "cbc:RoundingAmount",
        { currencyID: "SAR" },
        invoiceLine.TaxTotal.RoundingAmount.toFixed(2)
      )
      .up()
      .up()
      .ele("cac:Item")
      .ele("cbc:Name", invoiceLine.Item.Name)
      .up()
      .ele("cac:ClassifiedTaxCategory")
      .ele("cbc:ID", invoiceLine.Item.ClassifiedTaxCategory.ID)
      .up()
      .ele(
        "cbc:Percent",
        invoiceLine.Item.ClassifiedTaxCategory.Percent.toFixed(2)
      )
      .up()
      .ele("cac:TaxScheme")
      .ele("cbc:ID", invoiceLine.Item.ClassifiedTaxCategory.TaxScheme.ID)
      .up()
      .up()
      .up()
      .up()
      .ele("cac:Price")
      .ele(
        "cbc:PriceAmount",
        { currencyID: "SAR" },
        invoiceLine.Price.PriceAmount.toFixed(2)
      )
      .up()
      .ele("cac:AllowanceCharge")
      .ele(
        "cbc:ChargeIndicator",
        invoiceLine.Price.AllowanceCharge.ChargeIndicator.toString()
      )
      .up()
      .ele(
        "cbc:AllowanceChargeReason",
        invoiceLine.Price.AllowanceCharge.AllowanceChargeReason
      )
      .up()
      .ele(
        "cbc:Amount",
        { currencyID: "SAR" },
        invoiceLine.Price.AllowanceCharge.Amount.toFixed(2)
      )
      .up()
      .up()
      .up();
    line = line + xmlinvoiceLine.toString({ pretty: true });
    // xmlInvoiceLineList.push(xmlinvoiceLine.toString({ pretty: true }));
  });
  return line;
}

// Example usage

const invoiceLine2: InvoiceLine = {
  ID: 1,
  InvoicedQuantity: 221.0,
  LineExtensionAmount: 4.0,
  TaxTotal: {
    TaxAmount: 0.6,
    RoundingAmount: 4.6,
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
    PriceAmount: 2.0,
    AllowanceCharge: {
      ChargeIndicator: true,
      AllowanceChargeReason: "discount",
      Amount: 0.0,
    },
  },
};

const invoiceLine: InvoiceLine = {
  ID: 1,
  InvoicedQuantity: 221.0,
  LineExtensionAmount: 4.0,
  TaxTotal: {
    TaxAmount: 0.6,
    RoundingAmount: 4.6,
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
    PriceAmount: 2.0,
    AllowanceCharge: {
      ChargeIndicator: true,
      AllowanceChargeReason: "discount",
      Amount: 0.0,
    },
  },
};
const invoiceLineList: InvoiceLine[] = [invoiceLine2, invoiceLine];
const generatedXML = generateInvoiceLineXML(invoiceLineList);
console.log(generatedXML);
