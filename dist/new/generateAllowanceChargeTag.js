import * as builder from "xmlbuilder";
export function GenerateAllowanceChargeTag(AllowanceChargeData) {
    const xmlTag = builder
        .create("cac:AllowanceCharge")
        .ele("cbc:ChargeIndicator")
        .txt(AllowanceChargeData.ChargeIndicator.toString())
        .up()
        .ele("cbc:AllowanceChargeReason")
        .txt(AllowanceChargeData.AllowanceChargeReason.toString())
        .up()
        .ele("cbc:Amount", {
        currencyID: AllowanceChargeData.Amount.currencyID,
    })
        .txt(AllowanceChargeData.Amount.AmountValue.toString())
        .up()
        .ele("cac:TaxCategory")
        .ele("cbc:ID", { schemeID: "UN/ECE 5305", schemeAgencyID: "6" })
        .text(AllowanceChargeData.TaxCategory.id)
        .up()
        .ele("cbc:Percent")
        .text(AllowanceChargeData.TaxCategory.Percent)
        .up()
        .ele("cac:TaxScheme")
        .ele("cbc:ID", { schemeID: "UN/ECE 5153", schemeAgencyID: "6" })
        .txt(AllowanceChargeData.TaxCategory.TaxSchemeID)
        .up()
        .up()
        .up();
    console.log(xmlTag.toString({ pretty: true }));
    return xmlTag.toString({ pretty: true });
}
//# sourceMappingURL=generateAllowanceChargeTag.js.map