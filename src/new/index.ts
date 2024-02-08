import { GenerateAccountingCustomerPartyXML } from "./accountingPartyxmlTag.js";
import { Invoice, sampleInvoiceData } from "./dataType..js";

import { GenerateAllowanceChargeTag } from "./generateAllowanceChargeTag.js";
import { GenerateTaxTotalXML } from "./generateTaxTotalXmlTag.js";
import { invoiceInfoxmlTags } from "./invoiceInfoXmlTags.js";
import { generateInvoiceLineXML } from "./invoiceLinexml.js";
import { GenerateLegalMonetaryTotalXML } from "./LegalMonetaryTotalXmlTag.js";
import UBLXmlTag from "./UBLTag.js";

import fs from "fs";

const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
    xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
    xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
    xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">`;

const xmlFooter = `</Invoice>`;

function GenerateXMLFile(invoice: Invoice) {
  let xmlFile = xmlHeader;
  xmlFile = xmlFile + UBLXmlTag(invoice.ublTagData);
  xmlFile = xmlFile + invoiceInfoxmlTags(invoice.invoiceInfo);
  xmlFile =
    xmlFile +
    GenerateAccountingCustomerPartyXML(invoice.accountingSupplierParty);
  xmlFile =
    xmlFile +
    GenerateAccountingCustomerPartyXML(invoice.accountingCustomerParty);
  xmlFile = xmlFile + GenerateAllowanceChargeTag(invoice.allowanceCharge);
  xmlFile = xmlFile + GenerateTaxTotalXML(invoice.taxTotal);
  xmlFile = xmlFile + GenerateLegalMonetaryTotalXML(invoice.legalMonetaryTotal);
  xmlFile = xmlFile + generateInvoiceLineXML(invoice.invoiceLineItem);

  xmlFile = xmlFile + xmlFooter;
  fs.writeFile("ne-file22.xml", xmlFile, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Successfully wrote data to file!");
    }
  });
  return xmlFile;
}

const a = GenerateXMLFile(sampleInvoiceData);
console.log(a);

 
