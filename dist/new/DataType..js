export var MainInvoiceTypes;
(function (MainInvoiceTypes) {
    MainInvoiceTypes["Standard"] = "1000";
    MainInvoiceTypes["Simplified"] = "0100";
    MainInvoiceTypes["Standard_Simplified"] = "1100";
})(MainInvoiceTypes = MainInvoiceTypes || (MainInvoiceTypes = {}));
export var ZATCAInvoiceTypes;
(function (ZATCAInvoiceTypes) {
    ZATCAInvoiceTypes["INVOICE"] = "388";
    ZATCAInvoiceTypes["DEBIT_NOTE"] = "383";
    ZATCAInvoiceTypes["CREDIT_NOTE"] = "381";
})(ZATCAInvoiceTypes = ZATCAInvoiceTypes || (ZATCAInvoiceTypes = {}));
var currencyType;
(function (currencyType) {
    currencyType["SAR"] = "SAR";
    currencyType["USD"] = "USD";
})(currencyType || (currencyType = {}));
export var ZATCAPaymentMethods;
(function (ZATCAPaymentMethods) {
    ZATCAPaymentMethods["CASH"] = "10";
    ZATCAPaymentMethods["CREDIT"] = "30";
    ZATCAPaymentMethods["BANK_ACCOUNT"] = "42";
    ZATCAPaymentMethods["BANK_CARD"] = "48";
})(ZATCAPaymentMethods = ZATCAPaymentMethods || (ZATCAPaymentMethods = {}));
export var infotype;
(function (infotype) {
    infotype[infotype["AccountingCustomerParty"] = 0] = "AccountingCustomerParty";
    infotype[infotype["AccountingSupplierParty"] = 1] = "AccountingSupplierParty";
})(infotype = infotype || (infotype = {}));
// =======================================================
const allowanceCharge = {
    ChargeIndicator: false,
    AllowanceChargeReason: "discount",
    Amount: {
        AmountValue: 0.0,
        currencyID: currencyType.SAR,
    },
    TaxCategory: {
        id: "S",
        Percent: "15",
        TaxSchemeID: "VAT",
    },
};
export const sampleInvoiceData = {
    ublTagData: {
        invoice_hash: "sample_invoice_hash",
        signed_properties_hash: "sample_signed_properties_hash",
        digital_signature: "sample_digital_signature",
        certificate_string: "sample_certificate_string",
        signed_properties_xml: "sample_signed_properties_xml",
    },
    allowanceCharge: allowanceCharge,
    invoiceInfo: {
        ProfileID: "sample_ProfileID",
        ID: "sample_ID",
        UUID: "sample_UUID",
        IssueDate: "sample_IssueDate",
        IssueTime: "sample_IssueTime",
        DeliveryDate: "sample_DeliveryDate",
        previousInvoiceHash: "previousInvoiceHash",
        qr: "qr",
        PaymentMeans: ZATCAPaymentMethods.CASH,
        InvoiceTypeCode: {
            type: ZATCAInvoiceTypes.INVOICE,
            value: MainInvoiceTypes.Standard,
        },
        DocumentCurrencyCode: currencyType.SAR,
        TaxCurrencyCode: currencyType.SAR,
        InvoiceCounter: "sample_InvoiceCounter",
    },
    legalMonetaryTotal: {
        LineExtensionAmount: 100,
        TaxExclusiveAmount: 90,
        TaxInclusiveAmount: 100,
        AllowanceTotalAmount: 10,
        PrepaidAmount: 0,
        PayableAmount: 100,
    },
    taxTotal: {
        TaxAmount: 10,
        TaxSubtotal: {
            TaxableAmount: 90,
            TaxAmount: 10,
            TaxCategory: {
                ID: 1,
                Percent: 10,
                TaxSchemeID: 1,
            },
        },
    },
    accountingSupplierParty: {
        type: infotype.AccountingSupplierParty,
        Party: {
            PartyIdentification: {
                ID: "sample_PartyIdentification",
                schemeID: "sample_schemeID",
            },
            PostalAddress: {
                StreetName: "sample_StreetName",
                BuildingNumber: "sample_BuildingNumber",
                PlotIdentification: "sample_PlotIdentification",
                CitySubdivisionName: "sample_CitySubdivisionName",
                CityName: "sample_CityName",
                PostalZone: "sample_PostalZone",
                Country: "sample_Country",
            },
            PartyTaxScheme: "sample_PartyTaxScheme",
            RegistrationName: "sample_RegistrationName",
        },
    },
    accountingCustomerParty: {
        type: infotype.AccountingCustomerParty,
        Party: {
            PartyIdentification: {
                ID: "sample_PartyIdentification",
                schemeID: "sample_schemeID",
            },
            PostalAddress: {
                StreetName: "sample_StreetName",
                BuildingNumber: "sample_BuildingNumber",
                PlotIdentification: "sample_PlotIdentification",
                CitySubdivisionName: "sample_CitySubdivisionName",
                CityName: "sample_CityName",
                PostalZone: "sample_PostalZone",
                Country: "sample_Country",
            },
            PartyTaxScheme: "sample_PartyTaxScheme",
            RegistrationName: "sample_RegistrationName",
        },
    },
    invoiceLineItem: [
        {
            ID: 1,
            InvoicedQuantity: 10,
            LineExtensionAmount: 100,
            TaxTotal: {
                TaxAmount: 10,
                RoundingAmount: 0,
            },
            Item: {
                Name: "sample_ItemName",
                ClassifiedTaxCategory: {
                    ID: "sample_TaxCategoryID",
                    Percent: 10,
                    TaxScheme: {
                        ID: "sample_TaxSchemeID",
                    },
                },
            },
            Price: {
                PriceAmount: 10,
                AllowanceCharge: {
                    ChargeIndicator: false,
                    AllowanceChargeReason: "sample_AllowanceChargeReason",
                    Amount: 0,
                },
            },
        },
        {
            ID: 1,
            InvoicedQuantity: 10,
            LineExtensionAmount: 100,
            TaxTotal: {
                TaxAmount: 10,
                RoundingAmount: 0,
            },
            Item: {
                Name: "sample_ItemName",
                ClassifiedTaxCategory: {
                    ID: "sample_TaxCategoryID",
                    Percent: 10,
                    TaxScheme: {
                        ID: "sample_TaxSchemeID",
                    },
                },
            },
            Price: {
                PriceAmount: 10,
                AllowanceCharge: {
                    ChargeIndicator: false,
                    AllowanceChargeReason: "sample_AllowanceChargeReason",
                    Amount: 0,
                },
            },
        },
        {
            ID: 1,
            InvoicedQuantity: 10,
            LineExtensionAmount: 100,
            TaxTotal: {
                TaxAmount: 10,
                RoundingAmount: 0,
            },
            Item: {
                Name: "sample_ItemName",
                ClassifiedTaxCategory: {
                    ID: "sample_TaxCategoryID",
                    Percent: 10,
                    TaxScheme: {
                        ID: "sample_TaxSchemeID",
                    },
                },
            },
            Price: {
                PriceAmount: 10,
                AllowanceCharge: {
                    ChargeIndicator: false,
                    AllowanceChargeReason: "sample_AllowanceChargeReason",
                    Amount: 0,
                },
            },
        },
    ],
    // invoice_counter_number: 1,
    invoice_serial_number: "sample_invoice_serial_number",
    // issue_date: "sample_issue_date",
    // issue_time: "sample_issue_time",
    // previous_invoice_hash: "sample_previous_invoice_hash",
};
// console.log(sampleInvoiceData);
//# sourceMappingURL=dataType..js.map