import * as builder from "xmlbuilder";
export function GenerateLegalMonetaryTotalXML(LegalMonetaryTotalData) {
    const LegalMonetaryTotal = builder
        .create("cac:LegalMonetaryTotal")
        .ele("cbc:LineExtensionAmount", { currencyID: "SAR" })
        .txt(LegalMonetaryTotalData.LineExtensionAmount.toString())
        .up()
        .ele("cbc:TaxExclusiveAmount", { currencyID: "SAR" })
        .txt(LegalMonetaryTotalData.TaxExclusiveAmount.toString())
        .up()
        .ele("cbc:TaxInclusiveAmount", { currencyID: "SAR" })
        .txt(LegalMonetaryTotalData.TaxInclusiveAmount.toString())
        .up()
        .ele("cbc:AllowanceTotalAmount", { currencyID: "SAR" })
        .txt(LegalMonetaryTotalData.AllowanceTotalAmount.toString())
        .up()
        .ele("cbc:PrepaidAmount", { currencyID: "SAR" })
        .txt(LegalMonetaryTotalData.PrepaidAmount.toString())
        .up()
        .ele("cbc:PayableAmount", { currencyID: "SAR" })
        .txt(LegalMonetaryTotalData.PayableAmount.toString())
        .up();
    console.log(LegalMonetaryTotal.toString({ pretty: true }));
    return LegalMonetaryTotal.toString({ pretty: true });
}
//# sourceMappingURL=LegalMonetaryTotalXmlTag.js.map