import * as builder from "xmlbuilder";
export function GenerateTaxTotalXML(taxTotalData) {
    const tr = builder
        .create("cac:TaxTotal")
        .ele("cbc:TaxAmount", { currencyID: "SAR" })
        .txt(taxTotalData.TaxAmount.toString())
        .up();
    const rtr1 = builder
        .create("cac:TaxTotal")
        .ele("cbc:TaxAmount", { currencyID: "SAR" })
        .txt(taxTotalData.TaxAmount.toString())
        .up()
        .ele("cac:TaxSubtotal")
        .ele("cbc:TaxableAmount", { currencyID: "SAR" })
        .txt(taxTotalData.TaxSubtotal.TaxableAmount.toString())
        .up()
        .ele("cbc:TaxAmount", { currencyID: "SAR" })
        .txt(taxTotalData.TaxSubtotal.TaxAmount.toString())
        .up()
        .ele("cac:TaxCategory")
        .ele("cbc:ID", { schemeID: "UN/ECE 5305", schemeAgencyID: "6" })
        .txt(taxTotalData.TaxSubtotal.TaxCategory.ID.toString())
        .up()
        .ele("cbc:Percent")
        .txt(taxTotalData.TaxSubtotal.TaxCategory.Percent.toString())
        .up()
        .ele("cac:TaxScheme")
        .ele("cbc:ID", { schemeID: "UN/ECE 5153", schemeAgencyID: "6" })
        .txt(taxTotalData.TaxSubtotal.TaxCategory.TaxSchemeID.toString())
        .up()
        .up()
        .up()
        .up();
    const taxTotal = tr.toString({ pretty: true }) + rtr1.toString({ pretty: true });
    console.log(taxTotal);
    return taxTotal;
}
//# sourceMappingURL=generateTaxTotalXmlTag.js.map