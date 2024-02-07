// ===========================================================
import * as builder from "xmlbuilder";
import { InvoiceInfo } from "./dataType..js";

// ============================================

export function invoiceInfoxmlTags(invoiceInfo: InvoiceInfo) {
  const xmlTag = builder
    .create("root")
    .ele("cbc:ProfileID")
    .txt(invoiceInfo.ProfileID)
    .up()
    .ele("cbc:ID")
    .txt(invoiceInfo.ID)
    .up()
    .ele("cbc:UUID")
    .txt(invoiceInfo.UUID)
    .up()
    .ele("cbc:IssueDate")
    .txt(invoiceInfo.IssueDate)
    .up()
    .ele("cbc:IssueTime")
    .txt(invoiceInfo.IssueTime)
    .up()
    .ele("cbc:InvoiceTypeCode", { name: invoiceInfo.InvoiceTypeCode.value })
    .txt(invoiceInfo.InvoiceTypeCode.type)
    .up()
    .ele("cbc:DocumentCurrencyCode")
    .txt(invoiceInfo.DocumentCurrencyCode)
    .up()
    .ele("cbc:TaxCurrencyCode")
    .txt(invoiceInfo.TaxCurrencyCode)
    .up();
  invoiceInfo.BillingReferenceID != null
    ? xmlTag
        .ele("cac:BillingReference")
        .ele("cac:InvoiceDocumentReference")
        .ele("cbc:ID")
        .txt(invoiceInfo.BillingReferenceID)
        .up()
        .up()
        .up()
    : "";

  xmlTag
    .ele("cac:AdditionalDocumentReference")
    .ele("cbc:ID")
    .txt("ICV")
    .up()
    .ele("cbc:UUID")
    .txt(invoiceInfo.InvoiceCounter.toString())
    .up()
    .up()

    //
    .ele("cac:AdditionalDocumentReference")

    .ele("cbc:ID")
    .txt("PIH")
    .up()
    .ele("cac:Attachment")
    .ele("cbc:EmbeddedDocumentBinaryObject", { mimeCode: "text/plain" })
    .txt(invoiceInfo.previousInvoiceHash)
    .up()
    .up()
    .up()
    //
    .ele("cac:AdditionalDocumentReference")
    .ele("cbc:ID")
    .txt("QR")
    .up()

    .ele("cac:Attachment")
    .ele("cbc:EmbeddedDocumentBinaryObject", { mimeCode: "text/plain" })
    .txt(invoiceInfo.qr)
    .up()
    .up()
    .up()
    //
    .ele("cac:Signature")
    .ele("cbc:ID")
    .txt("urn:oasis:names:specification:ubl:signature:Invoice")
    .up()
    .ele("cbc:SignatureMethod")
    .txt("urn:oasis:names:specification:ubl:dsig:enveloped:xades")
    .up()
    .up();
  console.log(
    xmlTag
      .toString({ pretty: true })
      .replace("<root>", "")
      .replace("</root>", "")
  );
  return xmlTag
    .toString({ pretty: true })
    .replace("<root>", "")
    .replace("</root>", "");
}

//

export function generateDeliveryTag(deliveryDate) {
  const xmlTag = builder
    .create("cac:Delivery")
    .ele("cbc:ActualDeliveryDate")
    .txt(deliveryDate)
    .up();

  const xmlTag2 = builder
    .create("cac:PaymentMeans")
    .ele("cbc:PaymentMeansCode")
    .txt(deliveryDate)
    .up();
  console.log(
    xmlTag.toString({ pretty: true }) + xmlTag2.toString({ pretty: true })
  );
  return xmlTag.toString({ pretty: true }) + xmlTag2.toString({ pretty: true });
}
