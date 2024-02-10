import { ZATCASimplifiedTaxInvoice } from "./zatca/templates/ZATCATaxInvoice.js";
import { EGS, EGSUnitInfo } from "./zatca/egs/index.js";
import {
  CustomerLocation,
  DocumentCurrencyCode,
  ZATCAInvoiceTypes,
  ZATCAPaymentMethods,
  ZATCASimplifiedInvoiceLineItem,
  ZatcaCustomerInfo,
} from "./zatca/templates/tax_invoice_template.js";

import fs from "fs";

const line_item: ZATCASimplifiedInvoiceLineItem = {
  id: "1",
  name: "TEST NAME",
  quantity: 5,
  tax_exclusive_price: 10,
  VAT_percent: 0.15,

  // other_taxes: [{ percent_amount: 0.15 }],
  // discounts: [{ amount: 2, reason: "A discount" }],
};

// Sample EGSUnit
const egsunit: EGSUnitInfo = {
  uuid: "6f4d20e0-6bfe-4a80-9389-7dabe6620f12",
  custom_id: "EGS1-886431145",
  model: "IOS",
  CRN_number: "454634645645654",
  VAT_name: "aaaaaaaaaaaaa",
  VAT_number: "301121971500003",
  location: {
    city: "city",
    city_subdivision: "city_subdivision",
    street: "street street st",
    plot_identification: "0000",
    building: "0000",
    postal_zone: "31952",
  },
  branch_name: "Nassaco",
  branch_industry: "Food",
};
const customerAddress: CustomerLocation = {
  Street: "الرياض",
  BuildingNumber: "1111",
  PlotIdentification: "2223",
  CitySubdivisionName: "الرياض",
  CityName: "الدمام | Dammam",
  PostalZone: "12222",
  Country: "Acme Widget’s LTD 2",
};
const customer: ZatcaCustomerInfo = {
  NAT_number: "311111111111113",
  location: customerAddress,
  PartyTaxScheme: "string",
  RegistrationName: "Acme Widget’s LTD 2",
};

//  Invoice
const invoice = new ZATCASimplifiedTaxInvoice({
  props: {
    egs_info: egsunit,
    customerInfo: customer,
    documentCurrencyCode: DocumentCurrencyCode.USD,
    invoiceTypes: ZATCAInvoiceTypes.INVOICE,
    payment_method: ZATCAPaymentMethods.BANK_ACCOUNT,
    invoice_counter_number: 1,
    invoice_serial_number: "EGS1-886431145-1",
    issue_date: "2022-03-13",
    delivery_date: "2022-09-13",
    issue_time: "14:40:40",
    // billingReference: {
    //   BillingReference_invoice_number: 1,
    //   reason: "string",
    // },
    previous_invoice_hash:
      "NWZlY2ViNjZmZmM4NmYzOGQ5NTI3ODZjNmQ2OTZjNzljMmRiYzIzOWRkNGU5MWI0NjcyOWQ3M2EyN2ZiNTdlOQ==",
    line_items: [line_item],
  },
});

const main = async () => {
  try {
    const egs = new EGS(egsunit);

    await egs.generateNewKeysAndCSR(false, "Nassaco_Device");
    const compliance_request_id = await egs.issueComplianceCertificate(
      "123345"
    );

    //error
    // Sign invoice
    const { signed_invoice_string, invoice_hash, qr } =
      egs.signInvoice(invoice);

    // Check invoice compliance
    fs.writeFile("Invoice.xml", signed_invoice_string, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Successfully wrote data to file!");
      }
    });

    console.log(
      await egs.checkInvoiceCompliance(signed_invoice_string, invoice_hash)
    );

    // Issue production certificate
    const production_request_id = await egs.issueProductionCertificate(
      compliance_request_id
    );
    console.log(await egs.reportInvoice(signed_invoice_string, invoice_hash));
  } catch (error: any) {
    console.log(error.message ?? error);
  }
};

main();
