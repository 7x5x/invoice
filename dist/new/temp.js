// import * as builder from "xmlbuilder";
// import { Buffer } from "buffer";
// // interface InvoiceLine {
// //   ID: number;
// //   InvoicedQuantity: number;
// //   LineExtensionAmount: number;
// //   TaxAmount: number;
// //   RoundingAmount: number;
// //   Item: {
// //     Name: string;
// //     ClassifiedTaxCategory: {
// //       ID: string;
// //       Percent: number;
// //       TaxSchemeID: string;
// //     };
// //   };
// //   PriceAmount: number;
// //   ChargeIndicator: boolean;
// //   AllowanceChargeReason: string;
// //   AllowanceChargeAmount: number;
// // }
export {};
// // function generateInvoiceLineXML(invoiceLine: InvoiceLine): string {
// //   const xml = builder
// //     .create("cac:InvoiceLine")
// //     .ele("cbc:ID", invoiceLine.ID)
// //     .up()
// //     .ele(
// //       "cbc:InvoicedQuantity",
// //       { unitCode: "PCE" },
// //       invoiceLine.InvoicedQuantity
// //     )
// //     .up()
// //     .ele(
// //       "cbc:LineExtensionAmount",
// //       { currencyID: "SAR" },
// //       invoiceLine.LineExtensionAmount
// //     )
// //     .up()
// //     .ele("cac:TaxTotal")
// //     .ele("cbc:TaxAmount", { currencyID: "SAR" }, invoiceLine.TaxAmount)
// //     .up()
// //     .ele(
// //       "cbc:RoundingAmount",
// //       { currencyID: "SAR" },
// //       invoiceLine.RoundingAmount
// //     )
// //     .up()
// //     .up()
// //     .ele("cac:Item")
// //     .ele("cbc:Name", invoiceLine.Item.Name)
// //     .up()
// //     .ele("cac:ClassifiedTaxCategory")
// //     .ele("cbc:ID", invoiceLine.Item.ClassifiedTaxCategory.ID)
// //     .up()
// //     .ele("cbc:Percent", invoiceLine.Item.ClassifiedTaxCategory.Percent)
// //     .up()
// //     .ele("cac:TaxScheme")
// //     .ele("cbc:ID", invoiceLine.Item.ClassifiedTaxCategory.TaxSchemeID)
// //     .up()
// //     .up()
// //     .up()
// //     .ele("cac:Price")
// //     .ele("cbc:PriceAmount", { currencyID: "SAR" }, invoiceLine.PriceAmount)
// //     .up()
// //     .ele("cac:AllowanceCharge")
// //     .ele("cbc:ChargeIndicator", invoiceLine.ChargeIndicator)
// //     .up()
// //     .ele("cbc:AllowanceChargeReason", invoiceLine.AllowanceChargeReason)
// //     .up()
// //     .ele("cbc:Amount", { currencyID: "SAR" }, invoiceLine.AllowanceChargeAmount)
// //     .up()
// //     .up()
// //     .up()
// //     .end({ pretty: true });
// //   return xml;
// // }
// // // Example usage
// // const invoiceLine: InvoiceLine = {
// //   ID: 1,
// //   InvoicedQuantity: 10,
// //   LineExtensionAmount: 1000,
// //   TaxAmount: 150,
// //   RoundingAmount: 5,
// //   Item: {
// //     Name: "Product ABC",
// //     ClassifiedTaxCategory: {
// //       ID: "TAX001",
// //       Percent: 10,
// //       TaxSchemeID: "SCHEME001",
// //     },
// //   },
// //   PriceAmount: 100,
// //   ChargeIndicator: true,
// //   AllowanceChargeReason: "Discount",
// //   AllowanceChargeAmount: 50,
// // };
// // const generatedXML = generateInvoiceLineXML(invoiceLine);
// // console.log(generatedXML);
// //
// // import * as builder from "xmlbuilder";
// // interface InvoiceLine {
// //   ID: number;
// //   InvoicedQuantity: number;
// //   LineExtensionAmount: number;
// //   TaxAmount: number;
// //   RoundingAmount: number;
// //   Item: {
// //     Name: string;
// //     ClassifiedTaxCategory: {
// //       ID: string;
// //       Percent: number;
// //       TaxSchemeID: string;
// //     };
// //   };
// //   PriceAmount: number;
// //   ChargeIndicator: boolean;
// //   AllowanceChargeReason: string;
// //   AllowanceChargeAmount: number;
// // }
// // function generateInvoiceLineXML(invoiceLineList: InvoiceLine[]) {
// //   const xml = builder.create("InvoiceLineList");
// //   invoiceLineList.forEach((invoiceLine) => {
// //     const invoiceLineElement = xml.ele("cac:InvoiceLine");
// //     invoiceLineElement
// //       .ele("cbc:ID", invoiceLine.ID)
// //       .up()
// //       .ele(
// //         "cbc:InvoicedQuantity",
// //         { unitCode: "PCE" },
// //         invoiceLine.InvoicedQuantity
// //       )
// //       .up()
// //       .ele(
// //         "cbc:LineExtensionAmount",
// //         { currencyID: "SAR" },
// //         invoiceLine.LineExtensionAmount
// //       )
// //       .up()
// //       .ele("cac:TaxTotal")
// //       .ele("cbc:TaxAmount", { currencyID: "SAR" }, invoiceLine.TaxAmount)
// //       .up()
// //       .ele(
// //         "cbc:RoundingAmount",
// //         { currencyID: "SAR" },
// //         invoiceLine.RoundingAmount
// //       )
// //       .up()
// //       .up()
// //       .ele("cac:Item")
// //       .ele("cbc:Name", invoiceLine.Item.Name)
// //       .up()
// //       .ele("cac:ClassifiedTaxCategory")
// //       .ele("cbc:ID", invoiceLine.Item.ClassifiedTaxCategory.ID)
// //       .up()
// //       .ele("cbc:Percent", invoiceLine.Item.ClassifiedTaxCategory.Percent)
// //       .up()
// //       .ele("cac:TaxScheme")
// //       .ele("cbc:ID", invoiceLine.Item.ClassifiedTaxCategory.TaxSchemeID)
// //       .up()
// //       .up()
// //       .up()
// //       .ele("cac:Price")
// //       .ele("cbc:PriceAmount", { currencyID: "SAR" }, invoiceLine.PriceAmount)
// //       .up()
// //       .ele("cac:AllowanceCharge")
// //       .ele("cbc:ChargeIndicator", invoiceLine.ChargeIndicator)
// //       .up()
// //       .ele("cbc:AllowanceChargeReason", invoiceLine.AllowanceChargeReason)
// //       .up()
// //       .ele(
// //         "cbc:Amount",
// //         { currencyID: "SAR" },
// //         invoiceLine.AllowanceChargeAmount
// //       )
// //       .up()
// //       .up()
// //       .up();
// //   });
// //   return xml.end({ pretty: true });
// // }
// // // Example usage
// // const invoiceLine: InvoiceLine = {
// //   ID: 1,
// //   InvoicedQuantity: 10,
// //   LineExtensionAmount: 1000,
// //   TaxAmount: 150,
// //   RoundingAmount: 5,
// //   Item: {
// //     Name: "Product ABC",
// //     ClassifiedTaxCategory: {
// //       ID: "TAX001",
// //       Percent: 10,
// //       TaxSchemeID: "SCHEME001",
// //     },
// //   },
// //   PriceAmount: 100,
// //   ChargeIndicator: true,
// //   AllowanceChargeReason: "Discount",
// //   AllowanceChargeAmount: 50,
// // };
// // const invoiceLineList: InvoiceLine[] = [invoiceLine, invoiceLine, invoiceLine];
// // const generatedXML = generateInvoiceLineXML(invoiceLineList);
// // console.log(generatedXML);
// interface InvoiceLine {
//   ID: number;
//   InvoicedQuantity: number;
//   LineExtensionAmount: number;
//   TaxTotal: {
//     TaxAmount: number;
//     RoundingAmount: number;
//   };
//   Item: {
//     Name: string;
//     ClassifiedTaxCategory: {
//       ID: string;
//       Percent: number;
//       TaxScheme: {
//         ID: string;
//       };
//     };
//   };
//   Price: {
//     PriceAmount: number;
//     AllowanceCharge: {
//       ChargeIndicator: boolean;
//       AllowanceChargeReason: string;
//       Amount: number;
//     };
//   };
// }
// export function generateInvoiceLineXML(invoiceLineList: InvoiceLine[]) {
//   var te: any;
//   const xmlInvoiceLineList: any[] = [];
//   invoiceLineList.forEach((invoiceLine) => {
//     const xmlinvoiceLine = builder.create("cac:InvoiceLine");
//     xmlinvoiceLine
//       .ele("cbc:ID", {}, invoiceLine.ID.toString())
//       .up()
//       .ele("cbc:InvoicedQuantity", { unitCode: "PCE" })
//       .txt(invoiceLine.InvoicedQuantity.toFixed(6))
//       .up()
//       .ele(
//         "cbc:LineExtensionAmount",
//         { currencyID: "SAR" },
//         invoiceLine.LineExtensionAmount.toFixed(2)
//       )
//       .up()
//       .ele("cac:TaxTotal")
//       .ele(
//         "cbc:TaxAmount",
//         { currencyID: "SAR" },
//         invoiceLine.TaxTotal.TaxAmount.toFixed(2)
//       )
//       .up()
//       .ele(
//         "cbc:RoundingAmount",
//         { currencyID: "SAR" },
//         invoiceLine.TaxTotal.RoundingAmount.toFixed(2)
//       )
//       .up()
//       .up()
//       .ele("cac:Item")
//       .ele("cbc:Name", invoiceLine.Item.Name)
//       .up()
//       .ele("cac:ClassifiedTaxCategory")
//       .ele("cbc:ID", invoiceLine.Item.ClassifiedTaxCategory.ID)
//       .up()
//       .ele(
//         "cbc:Percent",
//         invoiceLine.Item.ClassifiedTaxCategory.Percent.toFixed(2)
//       )
//       .up()
//       .ele("cac:TaxScheme")
//       .ele("cbc:ID", invoiceLine.Item.ClassifiedTaxCategory.TaxScheme.ID)
//       .up()
//       .up()
//       .up()
//       .up()
//       .ele("cac:Price")
//       .ele(
//         "cbc:PriceAmount",
//         { currencyID: "SAR" },
//         invoiceLine.Price.PriceAmount.toFixed(2)
//       )
//       .up()
//       .ele("cac:AllowanceCharge")
//       .ele(
//         "cbc:ChargeIndicator",
//         invoiceLine.Price.AllowanceCharge.ChargeIndicator.toString()
//       )
//       .up()
//       .ele(
//         "cbc:AllowanceChargeReason",
//         invoiceLine.Price.AllowanceCharge.AllowanceChargeReason
//       )
//       .up()
//       .ele(
//         "cbc:Amount",
//         { currencyID: "SAR" },
//         invoiceLine.Price.AllowanceCharge.Amount.toFixed(2)
//       )
//       .up()
//       .up()
//       .up();
//     xmlInvoiceLineList.push(xmlinvoiceLine.toString({ pretty: true }));
//   });
//   return xmlInvoiceLineList;
// }
// // Example usage
// const invoiceLine2: InvoiceLine = {
//   ID: 1,
//   InvoicedQuantity: 221.0,
//   LineExtensionAmount: 4.0,
//   TaxTotal: {
//     TaxAmount: 0.6,
//     RoundingAmount: 4.6,
//   },
//   Item: {
//     Name: "قلم رصاص",
//     ClassifiedTaxCategory: {
//       ID: "S",
//       Percent: 15.0,
//       TaxScheme: {
//         ID: "VAT",
//       },
//     },
//   },
//   Price: {
//     PriceAmount: 2.0,
//     AllowanceCharge: {
//       ChargeIndicator: true,
//       AllowanceChargeReason: "discount",
//       Amount: 0.0,
//     },
//   },
// };
// const invoiceLine: InvoiceLine = {
//   ID: 1,
//   InvoicedQuantity: 221.0,
//   LineExtensionAmount: 4.0,
//   TaxTotal: {
//     TaxAmount: 0.6,
//     RoundingAmount: 4.6,
//   },
//   Item: {
//     Name: "قلم رصاص",
//     ClassifiedTaxCategory: {
//       ID: "S",
//       Percent: 15.0,
//       TaxScheme: {
//         ID: "VAT",
//       },
//     },
//   },
//   Price: {
//     PriceAmount: 2.0,
//     AllowanceCharge: {
//       ChargeIndicator: true,
//       AllowanceChargeReason: "discount",
//       Amount: 0.0,
//     },
//   },
// };
// const invoiceLineList: InvoiceLine[] = [invoiceLine2, invoiceLine];
// // const generatedXML = generateInvoiceLineXML(invoiceLineList);
// // console.log(generatedXML[0]);
// // ==========================
// interface LegalMonetaryTotal {
//   LineExtensionAmount: number;
//   TaxExclusiveAmount: number;
//   TaxInclusiveAmount: number;
//   AllowanceTotalAmount: number;
//   PrepaidAmount: number;
//   PayableAmount: number;
// }
// export function GenerateLegalMonetaryTotalXML(
//   LegalMonetaryTotalData: LegalMonetaryTotal
// ) {
//   const LegalMonetaryTotal = builder
//     .create("cac:LegalMonetaryTotal")
//     .ele("cbc:LineExtensionAmount", { currencyID: "SAR" })
//     .txt(LegalMonetaryTotalData.LineExtensionAmount.toString())
//     .up()
//     .ele("cbc:TaxExclusiveAmount", { currencyID: "SAR" })
//     .txt(LegalMonetaryTotalData.TaxExclusiveAmount.toString())
//     .up()
//     .ele("cbc:TaxInclusiveAmount", { currencyID: "SAR" })
//     .txt(LegalMonetaryTotalData.TaxInclusiveAmount.toString())
//     .up()
//     .ele("cbc:AllowanceTotalAmount", { currencyID: "SAR" })
//     .txt(LegalMonetaryTotalData.AllowanceTotalAmount.toString())
//     .up()
//     .ele("cbc:PrepaidAmount", { currencyID: "SAR" })
//     .txt(LegalMonetaryTotalData.PrepaidAmount.toString())
//     .up()
//     .ele("cbc:PayableAmount", { currencyID: "SAR" })
//     .txt(LegalMonetaryTotalData.PayableAmount.toString())
//     .up();
//   return LegalMonetaryTotal.toString({ pretty: true });
// }
// // Example usage
// const legalMonetaryTotal: LegalMonetaryTotal = {
//   LineExtensionAmount: 4.0,
//   TaxExclusiveAmount: 4.0,
//   TaxInclusiveAmount: 4.6,
//   AllowanceTotalAmount: 0.0,
//   PrepaidAmount: 0.0,
//   PayableAmount: 4.6,
// };
// // const generatedXML = GenerateLegalMonetaryTotalXML(legalMonetaryTotal);
// // console.log(generatedXML);
// interface TaxTotal {
//   TaxAmount: number;
//   TaxSubtotal: {
//     TaxableAmount: number;
//     TaxAmount: number;
//     TaxCategory: {
//       ID: number;
//       Percent: number;
//       TaxSchemeID: number;
//     };
//   };
// }
// export function GenerateTaxTotalXML(taxTotalData: TaxTotal) {
//   const tr = builder
//     .create("cac:TaxTotal")
//     .ele("cbc:TaxAmount", { currencyID: "SAR" })
//     .txt(taxTotalData.TaxAmount.toString())
//     .up();
//   const rtr1 = builder
//     .create("cac:TaxTotal")
//     .ele("cbc:TaxAmount", { currencyID: "SAR" })
//     .txt(taxTotalData.TaxAmount.toString())
//     .up()
//     .ele("cac:TaxSubtotal")
//     .ele("cbc:TaxableAmount", { currencyID: "SAR" })
//     .txt(taxTotalData.TaxSubtotal.TaxableAmount.toString())
//     .up()
//     .ele("cbc:TaxAmount", { currencyID: "SAR" })
//     .txt(taxTotalData.TaxSubtotal.TaxAmount.toString())
//     .up()
//     .ele("cac:TaxCategory")
//     .ele("cbc:ID", { schemeID: "UN/ECE 5305", schemeAgencyID: "6" })
//     .txt(taxTotalData.TaxSubtotal.TaxCategory.ID.toString())
//     .up()
//     .ele("cbc:Percent")
//     .txt(taxTotalData.TaxSubtotal.TaxCategory.Percent.toString())
//     .up()
//     .ele("cac:TaxScheme")
//     .ele("cbc:ID", { schemeID: "UN/ECE 5153", schemeAgencyID: "6" })
//     .txt(taxTotalData.TaxSubtotal.TaxCategory.TaxSchemeID.toString())
//     .up()
//     .up()
//     .up()
//     .up();
//   const taxTotal =
//     tr.toString({ pretty: true }) + rtr1.toString({ pretty: true });
//   return taxTotal;
// }
// const taxTotal: TaxTotal = {
//   TaxAmount: 0.6,
//   TaxSubtotal: {
//     TaxableAmount: 4.0,
//     TaxAmount: 0.6,
//     TaxCategory: {
//       ID: 123,
//       Percent: 15.0,
//       TaxSchemeID: 456,
//     },
//   },
// };
// // const generatedXML = GenerateTaxTotalXML(taxTotal);
// // // console.log(generatedXML);
// // =========================================
// enum infotype {
//   AccountingCustomerParty,
//   AccountingSupplierParty,
// }
// enum currencyType {
//   SAR = "SAR",
//   USD = "USD",
// }
// interface AccountingCustomerParty {
//   type: infotype;
//   Party: Party;
// }
// interface Party {
//   PartyIdentification: {
//     ID: string;
//     schemeID: string;
//   };
//   PostalAddress: PostalAddress;
//   PartyTaxScheme: string;
//   RegistrationName: string;
// }
// interface PostalAddress {
//   StreetName: string;
//   BuildingNumber: string;
//   PlotIdentification: string;
//   CitySubdivisionName: string;
//   CityName: string;
//   PostalZone: string;
//   Country: string;
// }
// function GenerateAccountingCustomerPartyXML(
//   CustomerPartyData: AccountingCustomerParty
// ) {
//   var tagType: string;
//   CustomerPartyData.type == infotype.AccountingCustomerParty
//     ? (tagType = "cac:AccountingCustomerParty")
//     : (tagType = "cac:AccountingSupplierParty");
//   const customerParty = builder
//     .create(tagType)
//     .ele("cac:Party")
//     .ele("cac:PartyIdentification")
//     .ele("cbc:ID", {
//       schemeID: CustomerPartyData.Party.PartyIdentification.schemeID.toString(),
//     })
//     .txt(CustomerPartyData.Party.PartyIdentification.ID)
//     .up()
//     .up()
//     .ele("cac:PostalAddress")
//     .ele("cbc:StreetName")
//     .txt(CustomerPartyData.Party.PostalAddress.StreetName.toString())
//     .up()
//     .ele("cbc:BuildingNumber")
//     .txt(CustomerPartyData.Party.PostalAddress.BuildingNumber.toString())
//     .up()
//     .ele("cbc:PlotIdentification")
//     .txt(CustomerPartyData.Party.PostalAddress.PlotIdentification.toString())
//     .up()
//     .ele("cbc:CitySubdivisionName")
//     .txt(CustomerPartyData.Party.PostalAddress.CitySubdivisionName.toString())
//     .up()
//     .ele("cbc:CityName")
//     .txt(CustomerPartyData.Party.PostalAddress.CityName.toString())
//     .up()
//     .ele("cbc:PostalZone")
//     .txt(CustomerPartyData.Party.PostalAddress.PostalZone.toString())
//     .up()
//     .ele("cac:Country")
//     .ele("cbc:IdentificationCode")
//     .txt(CustomerPartyData.Party.PostalAddress.Country.toString())
//     .up()
//     .up()
//     .up()
//     .ele("cac:PartyTaxScheme")
//     .ele("cac:TaxScheme")
//     .ele("cbc:ID")
//     .txt(CustomerPartyData.Party.PartyTaxScheme.toString())
//     .up()
//     .up()
//     .up()
//     .ele("cac:PartyLegalEntity")
//     .ele("cbc:RegistrationName")
//     .txt(CustomerPartyData.Party.RegistrationName.toString())
//     .up()
//     .up()
//     .up();
//   return customerParty.toString({ pretty: true });
// }
// const data: AccountingCustomerParty = {
//   type: infotype.AccountingSupplierParty,
//   Party: {
//     PartyIdentification: {
//       ID: "311111111111113",
//       schemeID: "NAT",
//     },
//     PostalAddress: {
//       StreetName: "الرياض",
//       BuildingNumber: "1111",
//       PlotIdentification: "2223",
//       CitySubdivisionName: "الرياض",
//       CityName: "الدمام | Dammam",
//       PostalZone: "12222",
//       Country: "SA",
//     },
//     PartyTaxScheme: "VAT",
//     RegistrationName: "Acme Widget’s LTD 2",
//   },
// };
// const data2: AccountingCustomerParty = {
//   type: infotype.AccountingCustomerParty,
//   Party: {
//     PartyIdentification: {
//       ID: "311111111111113",
//       schemeID: "NAT",
//     },
//     PostalAddress: {
//       StreetName: "الرياض",
//       BuildingNumber: "1111",
//       PlotIdentification: "2223",
//       CitySubdivisionName: "الرياض",
//       CityName: "الدمام | Dammam",
//       PostalZone: "12222",
//       Country: "SA",
//     },
//     PartyTaxScheme: "VAT",
//     RegistrationName: "Acme Widget’s LTD 2",
//   },
// };
// // const generatedXML = GenerateAccountingCustomerPartyXML(data);
// // const generatedXML1 = GenerateAccountingCustomerPartyXML(data2);
// // =========================================
// interface AllowanceCharge {
//   ChargeIndicator: boolean;
//   AllowanceChargeReason: string;
//   Amount: {
//     AmountValue: number;
//     currencyID: currencyType;
//   };
//   TaxCategory: {
//     id: string;
//     Percent: string;
//     TaxSchemeID: string;
//   };
// }
// export function GenerateAllowanceChargeTag(
//   AllowanceChargeData: AllowanceCharge
// ) {
//   const xmlTag = builder
//     .create("cac:AllowanceCharge")
//     .ele("cbc:ChargeIndicator")
//     .txt(AllowanceChargeData.ChargeIndicator.toString())
//     .up()
//     .ele("cbc:AllowanceChargeReason")
//     .txt(AllowanceChargeData.AllowanceChargeReason.toString())
//     .up()
//     .ele("cbc:Amount", {
//       currencyID: AllowanceChargeData.Amount.currencyID,
//     })
//     .txt(AllowanceChargeData.Amount.AmountValue.toString())
//     .up()
//     .ele("cac:TaxCategory")
//     .ele("cbc:ID", { schemeID: "UN/ECE 5305", schemeAgencyID: "6" })
//     .text(AllowanceChargeData.TaxCategory.id)
//     .up()
//     .ele("cbc:Percent")
//     .text(AllowanceChargeData.TaxCategory.Percent)
//     .up()
//     .ele("cac:TaxScheme")
//     .ele("cbc:ID", { schemeID: "UN/ECE 5153", schemeAgencyID: "6" })
//     .txt(AllowanceChargeData.TaxCategory.TaxSchemeID)
//     .up()
//     .up()
//     .up();
//   return xmlTag.toString({ pretty: true });
// }
// const allowanceCharge: AllowanceCharge = {
//   ChargeIndicator: false,
//   AllowanceChargeReason: "discount",
//   Amount: {
//     AmountValue: 0.0,
//     currencyID: currencyType.SAR,
//   },
//   TaxCategory: {
//     id: "S",
//     Percent: "15",
//     TaxSchemeID: "VAT",
//   },
// };
// // const generatedXML0 = GenerateAllowanceChargeTag(allowanceCharge);
// // console.log(generatedXML0);
// // =========================================
// function generateDeliveryTag(deliveryDate) {
//   const xmlTag = builder
//     .create("cac:Delivery")
//     .ele("cbc:ActualDeliveryDate")
//     .txt(deliveryDate)
//     .up();
//   const xmlTag2 = builder
//     .create("cac:PaymentMeans")
//     .ele("cbc:PaymentMeansCode")
//     .txt(deliveryDate)
//     .up();
//   return xmlTag.toString({ pretty: true }) + xmlTag2.toString({ pretty: true });
// }
// // const generatedXML = generateDeliveryTag("15");
// // console.log(generatedXML);
// // =========================================
// const generatedXML0 = GenerateAccountingCustomerPartyXML(data);
// const generatedXML1 = GenerateAccountingCustomerPartyXML(data2);
// const generatedXML = generateDeliveryTag("15");
// const generatedXML2 = GenerateAllowanceChargeTag(allowanceCharge);
// const generatedXML3 = GenerateTaxTotalXML(taxTotal);
// const generatedXML4 = GenerateLegalMonetaryTotalXML(legalMonetaryTotal);
// const generatedXML5 = generateInvoiceLineXML(invoiceLineList);
// const a =
//   generatedXML0 +
//   generatedXML1 +
//   generatedXML +
//   generatedXML2 +
//   generatedXML3 +
//   generatedXML4 +
//   generatedXML5[0] +
//   generatedXML5[1];
// // console.log(a);
// // const xmlInvoicebuffer = Buffer.from(a, "utf-8");
// // const base64Xml = xmlInvoicebuffer.toString("base64");
// // console.log(base64Xml);
// // =======================
//# sourceMappingURL=temp.js.map