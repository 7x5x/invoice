import { ZATCATaxInvoice } from "./zatca/templates/ZATCATaxInvoice.js";
import { EGS, EGSUnitInfo } from "./zatca/egs/index.js";
import {
  CustomerLocation,
  DocumentCurrencyCode,
  ZATCAInvoiceTypes,
  ZATCAPaymentMethods,
  ZATCAInvoiceLineItem,
  ZatcaCustomerInfo,
} from "./zatca/templates/tax_invoice_template.js";

import fs from "fs";

const line_item: ZATCAInvoiceLineItem = {
  id: "1",
  name: "TEST NAME",
  quantity: 1,
  tax_exclusive_price: 500,
  VAT_percent: 0.15,
  // other_taxes: [{ percent_amount: 0.15 }],
  Penalty: [],
  // invoice_level_discounts: [
  //   {
  //     reason: "aaaa",
  //     amount: 10.0,
  //   },
  // ],
};
const line_item2: ZATCAInvoiceLineItem = {
  id: "2",
  name: "TEST NAME",
  quantity: 2,
  tax_exclusive_price: 100,
  VAT_percent: 0.15,

  // other_taxes: [{ percent_amount: 0.15 }],
  invoice_line_level_discounts: [
    { amount: 20.0, reason: "A discount" },
    // { amount: 10.0, reason: "A discount" },
  ],
};

// Sample EGSUnit
const egsunit: EGSUnitInfo = {
  uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
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
const invoice = new ZATCATaxInvoice({
  props: {
    egs_info: egsunit,
    customerInfo: customer,
    invoice_counter_number: 1,
    invoice_serial_number: "EGS1-886431145-1",
    PrepaidAmount: 0,
    documentCurrencyCode: DocumentCurrencyCode.USD,
    payment_method: ZATCAPaymentMethods.BANK_ACCOUNT,
    issue_date: "2022-03-13",
    delivery_date: "2022-09-13",
    issue_time: "14:40:40",
    // cancelation: {
    //   canceled_invoice_number: 1,
    //   reason: "CANCELLATION_OR_TERMINATION",
    //   cancelation_type: ZATCAInvoiceTypes.DEBIT_NOTE,
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
