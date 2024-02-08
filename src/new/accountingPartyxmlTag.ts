import * as builder from "xmlbuilder";
import { AccountingPartyInfo, infotype } from "./dataType..js";

export function GenerateAccountingCustomerPartyXML(
  accountingPartyInfo: AccountingPartyInfo
) {
  var tagType: string;
  accountingPartyInfo.type == infotype.AccountingCustomerParty
    ? (tagType = "cac:AccountingCustomerParty")
    : (tagType = "cac:AccountingSupplierParty");

  const customerParty = builder
    .create(tagType)
    .ele("cac:Party")
    .ele("cac:PartyIdentification")
    .ele("cbc:ID", {
      schemeID:
        accountingPartyInfo.Party.PartyIdentification.schemeID.toString(),
    })
    .txt(accountingPartyInfo.Party.PartyIdentification.ID)
    .up()
    .up()
    .ele("cac:PostalAddress")
    .ele("cbc:StreetName")
    .txt(accountingPartyInfo.Party.PostalAddress.StreetName.toString())
    .up()
    .ele("cbc:BuildingNumber")
    .txt(accountingPartyInfo.Party.PostalAddress.BuildingNumber.toString())
    .up()
    .ele("cbc:PlotIdentification")
    .txt(accountingPartyInfo.Party.PostalAddress.PlotIdentification.toString())
    .up()
    .ele("cbc:CitySubdivisionName")
    .txt(accountingPartyInfo.Party.PostalAddress.CitySubdivisionName.toString())
    .up()
    .ele("cbc:CityName")
    .txt(accountingPartyInfo.Party.PostalAddress.CityName.toString())
    .up()
    .ele("cbc:PostalZone")
    .txt(accountingPartyInfo.Party.PostalAddress.PostalZone.toString())
    .up()
    .ele("cac:Country")
    .ele("cbc:IdentificationCode")
    .txt(accountingPartyInfo.Party.PostalAddress.Country.toString())
    .up()
    .up()
    .up()
    .ele("cac:PartyTaxScheme");
  accountingPartyInfo.Party.CompanyID != null
    ? customerParty
        .ele("cbc:CompanyID")
        .txt(accountingPartyInfo.Party.CompanyID)
        .up()
    : "";

  customerParty
    .ele("cac:TaxScheme")
    .ele("cbc:ID")
    .txt(accountingPartyInfo.Party.PartyTaxScheme.toString())
    .up()
    .up()
    .up()
    .ele("cac:PartyLegalEntity")
    .ele("cbc:RegistrationName")
    .txt(accountingPartyInfo.Party.RegistrationName.toString())
    .up()
    .up()
    .up();
  console.log(customerParty.toString({ pretty: true }));
  return customerParty.toString({ pretty: true });
}

const data: AccountingPartyInfo = {
  type: infotype.AccountingSupplierParty,
  Party: {
    PartyIdentification: {
      ID: "311111111111113",
      schemeID: "NAT",
    },
    PostalAddress: {
      StreetName: "الرياض",
      BuildingNumber: "1111",
      PlotIdentification: "2223",
      CitySubdivisionName: "الرياض",
      CityName: "الدمام | Dammam",
      PostalZone: "12222",
      Country: "SA",
    },
    PartyTaxScheme: "VAT",
    RegistrationName: "Acme Widget’s LTD 2",
  },
};
const data2: AccountingPartyInfo = {
  type: infotype.AccountingCustomerParty,
  Party: {
    PartyIdentification: {
      ID: "311111111111113",
      schemeID: "NAT",
    },
    PostalAddress: {
      StreetName: "الرياض",
      BuildingNumber: "1111",
      PlotIdentification: "2223",
      CitySubdivisionName: "الرياض",
      CityName: "الدمام | Dammam",
      PostalZone: "12222",
      Country: "SA",
    },
    PartyTaxScheme: "VAT",
    RegistrationName: "Acme Widget’s LTD 2",
  },
};
