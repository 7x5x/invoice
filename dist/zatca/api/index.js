import axios from "axios";
import { cleanUpCertificateString } from "../signing/index.js";
const settings = {
    API_VERSION: "V2",
    SANDBOX_BASEURL: "https://gw-apic-gov.gazt.gov.sa/e-invoicing/developer-portal",
    PRODUCTION_BASEURL: "TODO",
};
class API {
    constructor() {
        this.getAuthHeaders = (certificate, secret) => {
            if (certificate && secret) {
                console.log("certificate");
                console.log(certificate);
                console.log(secret);
                const certificate_stripped = cleanUpCertificateString(certificate);
                const basic = Buffer.from(`${Buffer.from(certificate_stripped).toString("base64")}:${secret}`).toString("base64");
                return {
                    Authorization: `Basic ${basic}`,
                };
            }
            return {};
        };
    }
    compliance(certificate, secret) {
        console.log("compliance", certificate, secret);
        const auth_headers = this.getAuthHeaders(certificate, secret);
        const issueCertificate = async (csr, otp) => {
            const headers = {
                "Accept-Version": settings.API_VERSION,
                OTP: otp,
            };
            const response = await axios.post(`${settings.SANDBOX_BASEURL}/compliance`, { csr: Buffer.from(csr).toString("base64") }, { headers: { ...auth_headers, ...headers } });
            if (response.status != 200)
                throw new Error("Error issuing a compliance certificate.");
            let issued_certificate = Buffer.from(response.data.binarySecurityToken, "base64").toString();
            issued_certificate = `-----BEGIN CERTIFICATE-----\n${issued_certificate}\n-----END CERTIFICATE-----`;
            const api_secret = response.data.secret;
            return {
                issued_certificate,
                api_secret,
                request_id: response.data.requestID,
            };
        };
        const checkInvoiceCompliance = async (signed_xml_string, invoice_hash, egs_uuid) => {
            const headers = {
                "Accept-Version": settings.API_VERSION,
                "Accept-Language": "en",
            };
            console.log('==========api- post=======Buffer.from(signed_xml_string).toString');
            console.log(Buffer.from(signed_xml_string).toString());
            console.log('==========api- post=======Buffer.from(signed_xml_string).toString("base64")==========');
            console.log(Buffer.from(signed_xml_string).toString("base64"));
            const response = await axios.post(`${settings.SANDBOX_BASEURL}/compliance/invoices`, {
                invoiceHash: invoice_hash,
                uuid: egs_uuid,
                invoice: Buffer.from(signed_xml_string).toString("base64"),
            }, { headers: { ...auth_headers, ...headers } });
            if (response.status != 200)
                throw new Error("Error in compliance check.");
            return response.data;
        };
        return {
            issueCertificate,
            checkInvoiceCompliance,
        };
    }
    production(certificate, secret) {
        const auth_headers = this.getAuthHeaders(certificate, secret);
        const issueCertificate = async (compliance_request_id) => {
            const headers = {
                "Accept-Version": settings.API_VERSION,
            };
            const response = await axios.post(`${settings.SANDBOX_BASEURL}/production/csids`, { compliance_request_id: compliance_request_id }, { headers: { ...auth_headers, ...headers } });
            if (response.status != 200)
                throw new Error("Error issuing a production certificate.");
            let issued_certificate = new Buffer(response.data.binarySecurityToken, "base64").toString();
            issued_certificate = `-----BEGIN CERTIFICATE-----\n${issued_certificate}\n-----END CERTIFICATE-----`;
            const api_secret = response.data.secret;
            return {
                issued_certificate,
                api_secret,
                request_id: response.data.requestID,
            };
        };
        const reportInvoice = async (signed_xml_string, invoice_hash, egs_uuid) => {
            const headers = {
                "Accept-Version": settings.API_VERSION,
                "Accept-Language": "en",
                "Clearance-Status": "0",
            };
            const response = await axios.post(`${settings.SANDBOX_BASEURL}/invoices/reporting/single`, {
                invoiceHash: invoice_hash,
                uuid: egs_uuid,
                invoice: Buffer.from(signed_xml_string).toString("base64"),
            }, { headers: { ...auth_headers, ...headers } });
            if (response.status != 200)
                throw new Error("Error in reporting invoice.");
            return response.data;
        };
        return {
            issueCertificate,
            reportInvoice,
        };
    }
}
export default API;
//# sourceMappingURL=index.js.map