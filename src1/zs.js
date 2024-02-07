"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLDocument = void 0;
var fast_xml_parser_1 = require("fast-xml-parser");
var lodash_1 = require("lodash");
// import { log } from "../logger";
var template = /* XML */ "\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Invoice xmlns=\"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2\" xmlns:cac=\"urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2\" xmlns:cbc=\"urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2\" xmlns:ext=\"urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2\"><ext:UBLExtensions>SET_UBL_EXTENSIONS_STRING</ext:UBLExtensions>\n    \n    <cbc:ProfileID>reporting:1.0</cbc:ProfileID>\n    <cbc:ID>SET_INVOICE_SERIAL_NUMBER</cbc:ID>\n    <cbc:UUID>SET_TERMINAL_UUID</cbc:UUID>\n    <cbc:IssueDate>SET_ISSUE_DATE</cbc:IssueDate>\n    <cbc:IssueTime>SET_ISSUE_TIME</cbc:IssueTime>\n    <cbc:InvoiceTypeCode name=\"0211010\">SET_INVOICE_TYPE</cbc:InvoiceTypeCode>\n    <cbc:DocumentCurrencyCode>SAR</cbc:DocumentCurrencyCode>\n    <cbc:TaxCurrencyCode>SAR</cbc:TaxCurrencyCode>\n    SET_BILLING_REFERENCE\n    <cac:AdditionalDocumentReference>\n        <cbc:ID>ICV</cbc:ID>\n        <cbc:UUID>SET_INVOICE_COUNTER_NUMBER</cbc:UUID>\n    </cac:AdditionalDocumentReference>\n    <cac:AdditionalDocumentReference>\n        <cbc:ID>PIH</cbc:ID>\n        <cac:Attachment>\n            <cbc:EmbeddedDocumentBinaryObject mimeCode=\"text/plain\">SET_PREVIOUS_INVOICE_HASH</cbc:EmbeddedDocumentBinaryObject>\n        </cac:Attachment>\n    </cac:AdditionalDocumentReference>\n    <cac:AdditionalDocumentReference>\n        <cbc:ID>QR</cbc:ID>\n        <cac:Attachment>\n            <cbc:EmbeddedDocumentBinaryObject mimeCode=\"text/plain\">SET_QR_CODE_DATA</cbc:EmbeddedDocumentBinaryObject>\n        </cac:Attachment>\n    </cac:AdditionalDocumentReference>\n    <cac:Signature>\n        <cbc:ID>urn:oasis:names:specification:ubl:signature:Invoice</cbc:ID>\n        <cbc:SignatureMethod>urn:oasis:names:specification:ubl:dsig:enveloped:xades</cbc:SignatureMethod>\n    </cac:Signature>\n    <cac:AccountingSupplierParty>\n    <cac:Party>\n      <cac:PartyIdentification>\n        <cbc:ID schemeID=\"CRN\">SET_COMMERCIAL_REGISTRATION_NUMBER</cbc:ID>\n      </cac:PartyIdentification>\n      <cac:PostalAddress>\n        <cbc:StreetName>SET_STREET_NAME</cbc:StreetName>\n        <cbc:BuildingNumber>SET_BUILDING_NUMBER</cbc:BuildingNumber>\n        <cbc:PlotIdentification>SET_PLOT_IDENTIFICATION</cbc:PlotIdentification>\n        <cbc:CitySubdivisionName>SET_CITY_SUBDIVISION</cbc:CitySubdivisionName>\n        <cbc:CityName>SET_CITY</cbc:CityName>\n        <cbc:PostalZone>SET_POSTAL_NUMBER</cbc:PostalZone>\n        <cac:Country>\n          <cbc:IdentificationCode>SA</cbc:IdentificationCode>\n        </cac:Country>\n      </cac:PostalAddress>\n      <cac:PartyTaxScheme>\n        <cbc:CompanyID>SET_VAT_NUMBER</cbc:CompanyID>\n        <cac:TaxScheme>\n          <cbc:ID>VAT</cbc:ID>\n        </cac:TaxScheme>\n      </cac:PartyTaxScheme>\n      <cac:PartyLegalEntity>\n        <cbc:RegistrationName>SET_VAT_NAME</cbc:RegistrationName>\n      </cac:PartyLegalEntity>\n    </cac:Party>\n  </cac:AccountingSupplierParty>\n  <cac:AccountingCustomerParty></cac:AccountingCustomerParty>\n</Invoice>\n";
var XMLDocument = /** @class */ (function () {
    function XMLDocument(xml_str) {
        var _a;
        this.parser_options = {
            ignoreAttributes: false,
            ignoreDeclaration: false,
            ignorePiTags: false,
            parseTagValue: false,
        };
        var parser = new fast_xml_parser_1.XMLParser(this.parser_options);
        if (xml_str) {
            this.xml_object = (_a = parser.parse(xml_str)) !== null && _a !== void 0 ? _a : {};
        }
        else {
            this.xml_object = {
                "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
            };
        }
    }
    XMLDocument.prototype.getElement = function (xml_object, path_query, parent_xml_object, last_tag) {
        if (path_query == "" || !xml_object)
            return { xml_object: xml_object, parent_xml_object: parent_xml_object, last_tag: last_tag };
        var current_path = path_query.split("/");
        var current_tag = current_path.splice(0, 1)[0];
        var new_query_path = current_path.join("/");
        return this.getElement(xml_object[current_tag], new_query_path, xml_object, current_tag);
    };
    XMLDocument.prototype.filterByCondition = function (result, condition) {
        return lodash_1.default.filter(result, lodash_1.default.matches(condition));
    };
    /**
     * Queries the XML for a specific element given its path in tags.
     * Accepts condition for filtering.
     * @param path_query String path of element tags. e.g: "Invoice/cac:Delivery/cbc:ActualDeliveryDate"
     * @param condition Any condition. e.g: {"name": "example"}, "2022-03-13"
     * @returns Array of elements/element if found. undefined if no match found.
     */
    XMLDocument.prototype.get = function (path_query, condition) {
        if (!this.xml_object)
            return;
        var xml_object = this.getElement(this.xml_object, path_query !== null && path_query !== void 0 ? path_query : "").xml_object;
        var query_result = xml_object;
        if (query_result && !(query_result instanceof Array)) {
            query_result = [query_result];
        }
        if (condition) {
            query_result = this.filterByCondition(query_result, condition);
        }
        return lodash_1.default.isEmpty(query_result) ? undefined : query_result;
    };
    /**
     * Queries and deletes the XML for a specific element given its path in tags.
     * Accepts condition for filtering.
     * @param path_query String path of element tags. e.g: "Invoice/cac:Delivery/cbc:ActualDeliveryDate"
     * @param condition Any condition. e.g: {"name": "example"}, "2022-03-13"
     * @returns Boolean true if deleted, false if no match.
     */
    XMLDocument.prototype.delete = function (path_query, condition) {
        if (!this.xml_object)
            return false;
        var _a = this.getElement(this.xml_object, path_query !== null && path_query !== void 0 ? path_query : ""), xml_object = _a.xml_object, parent_xml_object = _a.parent_xml_object, last_tag = _a.last_tag;
        var query_result = xml_object;
        if (query_result && !(query_result instanceof Array)) {
            query_result = [query_result];
        }
        if (condition) {
            query_result = this.filterByCondition(query_result, condition);
        }
        if (lodash_1.default.isEmpty(query_result))
            return false;
        if (parent_xml_object[last_tag] instanceof Array) {
            parent_xml_object[last_tag] = lodash_1.default.filter(parent_xml_object[last_tag], function (element) {
                return !lodash_1.default.matches(condition)(element);
            });
            if (lodash_1.default.isEmpty(parent_xml_object[last_tag]))
                delete parent_xml_object[last_tag];
        }
        else {
            delete parent_xml_object[last_tag];
        }
        return true;
    };
    /**
     * Sets (Adds if does not exist) an XMLObject to a specific element given its path in tags.
     * Requires the query path to be already in the XML. It does not create the path for you.
     * Accepts condition for filtering.
     * @param path_query String path of element tags. e.g: "Invoice/cac:Delivery/cbc:ActualDeliveryDate"
     * @param overwrite Boolean makes operation a set instead of an add.
     * @param set_xml XMLObject or String for other values to be set/added.
     * @returns Boolean true if set/add, false if unable to set/add.
     */
    XMLDocument.prototype.set = function (path_query, overwrite, set_xml) {
        if (!this.xml_object)
            return false;
        var path_tags = path_query.split("/");
        var tag = path_tags.splice(path_tags.length - 1, 1)[0];
        path_query = path_tags.join("/");
        var _a = this.getElement(this.xml_object, path_query !== null && path_query !== void 0 ? path_query : ""), xml_object = _a.xml_object, parent_xml_object = _a.parent_xml_object, last_tag = _a.last_tag;
        if (lodash_1.default.isEmpty(xml_object))
            return false;
        // Workaround for adding to root (since it has no key)
        if (!path_query) {
            parent_xml_object = { root: this.xml_object };
            last_tag = "root";
        }
        try {
            if (parent_xml_object[last_tag][tag] instanceof Array) {
                parent_xml_object[last_tag][tag] = !overwrite
                    ? __spreadArray(__spreadArray([], parent_xml_object[last_tag][tag], true), [set_xml], false) : set_xml;
            }
            else {
                if (parent_xml_object[last_tag][tag]) {
                    // Tag already exists but is not an Array. (Adding to it should turn it into an array)
                    parent_xml_object[last_tag][tag] = !overwrite
                        ? [parent_xml_object[last_tag][tag], set_xml]
                        : set_xml;
                }
                else {
                    // New tag
                    parent_xml_object[last_tag][tag] = set_xml;
                }
            }
            return true;
        }
        catch (error) {
            //   log("Info", "Parser", error.message);
        }
        return false;
    };
    XMLDocument.prototype.toString = function (_a) {
        var no_header = _a.no_header;
        var builder_options = __assign(__assign({}, this.parser_options), { format: true, indentBy: "    " });
        var builder = new fast_xml_parser_1.XMLBuilder(builder_options);
        var xml_str = builder.build(this.xml_object);
        if (no_header)
            xml_str = xml_str.replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "");
        xml_str = xml_str.replace(/&apos;/g, "'");
        return xml_str;
    };
    return XMLDocument;
}());
exports.XMLDocument = XMLDocument;
var xmlDoc = new XMLDocument(template);
var name = xmlDoc.get("Invoice/cbc:ProfileID");
console.log(name);
