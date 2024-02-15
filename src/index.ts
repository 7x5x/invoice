import { ZATCATaxInvoice } from "./zatca/templates/ZATCATaxInvoice.js";
import { EGS, EGSUnitInfo } from "./zatca/egs/index.js";
import {
  CustomerLocation,
  DocumentCurrencyCode,
  ZATCAPaymentMethods,
  ZATCAInvoiceLineItem,
  ZatcaCustomerInfo,
} from "./zatca/templates/tax_invoice_template.js";
import fs from "fs";
import { Console, log } from "console";
import { LogError } from "concurrently";

const line_item: ZATCAInvoiceLineItem = {
  id: "1",
  name: "TEST NAME",
  note: "note",
  quantity: 1,
  tax_exclusive_price: 1000,
  VAT_percent: 0.15,
  Penalty: [],
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
    conversion_rate: 3.75,
    documentCurrencyCode: DocumentCurrencyCode.SAR,
    payment_method: ZATCAPaymentMethods.CASH,
    issue_date: "2024-02-13",
    delivery_date: "2024-03-13",
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

export const main = async () => {
  console.log(line_item.name);
  console.log(line_item.discounts);
  try {
    const egs = new EGS(egsunit);

    await egs.generateNewKeysAndCSR(false, "Nassaco_Device");
    const compliance_request_id = await egs.issueComplianceCertificate(
      "123345"
    );

    const { signed_invoice_string, invoice_hash, qr } =
      egs.signInvoice(invoice);

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
    const production_request_id = await egs.issueProductionCertificate(
      compliance_request_id
    );
    console.log(await egs.reportInvoice(signed_invoice_string, invoice_hash));
  } catch (error: any) {
    console.log(error.message ?? error);
  }
};

// main();
export const tem = (line_itemData: ZATCAInvoiceLineItem) => {
  const line_item2: ZATCAInvoiceLineItem = {
    id: line_itemData.id + 2,
    name: line_itemData.name,
    note: line_itemData.note,
    quantity: line_itemData.quantity,
    tax_exclusive_price: line_itemData.tax_exclusive_price,
    VAT_percent: line_itemData.VAT_percent,
  };
  console.log("from tem");
  return line_item2;
};
