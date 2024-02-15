import axios from "axios";
import { cleanUpCertificateString } from "../signing/index.js";
import fs from "fs";
const settings = {
  API_VERSION: "V2",
  SANDBOX_BASEURL:
    "https://gw-apic-gov.gazt.gov.sa/e-invoicing/developer-portal",
  PRODUCTION_BASEURL: "TODO",
};

interface ComplianceAPIInterface {
  /**
   * Requests a new compliance certificate and secret.
   * @param csr String CSR
   * @param otp String Tax payer provided OTP from Fatoora portal
   * @returns issued_certificate: string, api_secret: string, or throws on error.
   */
  issueCertificate: (
    csr: string,
    otp: string
  ) => Promise<{
    issued_certificate: string;
    api_secret: string;
    request_id: string;
  }>;

  /**
   * Checks compliance of a signed ZATCA XML.
   * @param signed_xml_string String.
   * @param invoice_hash String.
   * @param egs_uuid String.
   * @returns Any status.
   */
  checkInvoiceCompliance: (
    signed_xml_string: string,
    invoice_hash: string,
    egs_uuid: string
  ) => Promise<any>;
}

interface ProductionAPIInterface {
  /**
   * Requests a new production certificate and secret.
   * @param compliance_request_id String compliance_request_id
   * @returns issued_certificate: string, api_secret: string, or throws on error.
   */
  issueCertificate: (compliance_request_id: string) => Promise<{
    issued_certificate: string;
    api_secret: string;
    request_id: string;
  }>;

  /**
   * Report signed ZATCA XML.
   * @param signed_xml_string String.
   * @param invoice_hash String.
   * @param egs_uuid String.
   * @returns Any status.
   */
  reportInvoice: (
    signed_xml_string: string,
    invoice_hash: string,
    egs_uuid: string
  ) => Promise<any>;
}

class API {
  constructor() {}

  private getAuthHeaders = (certificate?: string, secret?: string): any => {
    if (certificate && secret) {
      const certificate_stripped = cleanUpCertificateString(certificate);
      const basic = Buffer.from(
        `${Buffer.from(certificate_stripped).toString("base64")}:${secret}`
      ).toString("base64");
      return {
        Authorization: `Basic ${basic}`,
      };
    }
    return {};
  };

  compliance(certificate?: string, secret?: string): ComplianceAPIInterface {
    const auth_headers = this.getAuthHeaders(certificate, secret);

    const issueCertificate = async (
      csr: string,
      otp: string
    ): Promise<{
      issued_certificate: string;
      api_secret: string;
      request_id: string;
    }> => {
      const headers = {
        "Accept-Version": settings.API_VERSION,
        OTP: otp,
      };

      const response = await axios.post(
        `${settings.SANDBOX_BASEURL}/compliance`,
        { csr: Buffer.from(csr).toString("base64") },
        { headers: { ...auth_headers, ...headers } }
      );

      if (response.status != 200)
        throw new Error("Error issuing a compliance certificate.");

      let issued_certificate = Buffer.from(
        response.data.binarySecurityToken,
        "base64"
      ).toString();
      issued_certificate = `-----BEGIN CERTIFICATE-----\n${issued_certificate}\n-----END CERTIFICATE-----`;
      const api_secret = response.data.secret;

      return {
        issued_certificate,
        api_secret,
        request_id: response.data.requestID,
      };
    };

    const checkInvoiceCompliance = async (
      signed_xml_string: string,
      invoice_hash: string,
      egs_uuid: string
    ): Promise<any> => {
      const headers = {
        "Accept-Version": settings.API_VERSION,
        "Accept-Language": "en",
      };

      const response = await axios.post(
        `${settings.SANDBOX_BASEURL}/compliance/invoices`,
        {
          invoiceHash: invoice_hash,
          uuid: egs_uuid,
          invoice: Buffer.from(signed_xml_string).toString("base64"),
        },
        { headers: { ...auth_headers, ...headers } }
      );

      if (response.status != 200) throw new Error("Error in compliance check.");
      return response.data;
    };

    return {
      issueCertificate,
      checkInvoiceCompliance,
    };
  }

  production(certificate?: string, secret?: string): ProductionAPIInterface {
    const auth_headers = this.getAuthHeaders(certificate, secret);

    const issueCertificate = async (
      compliance_request_id: string
    ): Promise<{
      issued_certificate: string;
      api_secret: string;
      request_id: string;
    }> => {
      const headers = {
        "Accept-Version": settings.API_VERSION,
      };

      const response = await axios.post(
        `${settings.SANDBOX_BASEURL}/production/csids`,
        { compliance_request_id: compliance_request_id },
        { headers: { ...auth_headers, ...headers } }
      );

      if (response.status != 200)
        throw new Error("Error issuing a production certificate.");

      let issued_certificate = Buffer.from(
        response.data.binarySecurityToken,
        "base64"
      ).toString();
      issued_certificate = `-----BEGIN CERTIFICATE-----\n${issued_certificate}\n-----END CERTIFICATE-----`;
      const api_secret = response.data.secret;

      console.log(response.data);
      return {
        issued_certificate,
        api_secret,
        request_id: response.data.requestID,
      };
    };

    const reportInvoice = async (
      signed_xml_string: string,
      invoice_hash: string,
      egs_uuid: string
    ): Promise<any> => {
      const headers = {
        "Accept-Version": settings.API_VERSION,
        "Accept-Language": "en",
        "Clearance-Status": "1",
      };

      // const response = await axios.post(
      //   `${settings.SANDBOX_BASEURL}/invoices/clearance/single`,
      //   {
      //     invoiceHash: "f+0WCqnPkInI+eL9G3LAry12fTPf+toC9UX07F4fI+s=",
      //     uuid: "8d487816-70b8-4ade-a618-9d620b73814a",
      //     invoice:
      //       "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPEludm9pY2UgeG1sbnM9InVybjpvYXNpczpuYW1lczpzcGVjaWZpY2F0aW9uOnVibDpzY2hlbWE6eHNkOkludm9pY2UtMiIgeG1sbnM6Y2FjPSJ1cm46b2FzaXM6bmFtZXM6c3BlY2lmaWNhdGlvbjp1Ymw6c2NoZW1hOnhzZDpDb21tb25BZ2dyZWdhdGVDb21wb25lbnRzLTIiIHhtbG5zOmNiYz0idXJuOm9hc2lzOm5hbWVzOnNwZWNpZmljYXRpb246dWJsOnNjaGVtYTp4c2Q6Q29tbW9uQmFzaWNDb21wb25lbnRzLTIiIHhtbG5zOmV4dD0idXJuOm9hc2lzOm5hbWVzOnNwZWNpZmljYXRpb246dWJsOnNjaGVtYTp4c2Q6Q29tbW9uRXh0ZW5zaW9uQ29tcG9uZW50cy0yIj48ZXh0OlVCTEV4dGVuc2lvbnM+CiAgICA8ZXh0OlVCTEV4dGVuc2lvbj4KICAgICAgICA8ZXh0OkV4dGVuc2lvblVSST51cm46b2FzaXM6bmFtZXM6c3BlY2lmaWNhdGlvbjp1Ymw6ZHNpZzplbnZlbG9wZWQ6eGFkZXM8L2V4dDpFeHRlbnNpb25VUkk+CiAgICAgICAgPGV4dDpFeHRlbnNpb25Db250ZW50PgogICAgICAgICAgICA8c2lnOlVCTERvY3VtZW50U2lnbmF0dXJlcyB4bWxuczpzaWc9InVybjpvYXNpczpuYW1lczpzcGVjaWZpY2F0aW9uOnVibDpzY2hlbWE6eHNkOkNvbW1vblNpZ25hdHVyZUNvbXBvbmVudHMtMiIgeG1sbnM6c2FjPSJ1cm46b2FzaXM6bmFtZXM6c3BlY2lmaWNhdGlvbjp1Ymw6c2NoZW1hOnhzZDpTaWduYXR1cmVBZ2dyZWdhdGVDb21wb25lbnRzLTIiIHhtbG5zOnNiYz0idXJuOm9hc2lzOm5hbWVzOnNwZWNpZmljYXRpb246dWJsOnNjaGVtYTp4c2Q6U2lnbmF0dXJlQmFzaWNDb21wb25lbnRzLTIiPgogICAgICAgICAgICAgICAgPHNhYzpTaWduYXR1cmVJbmZvcm1hdGlvbj4gCiAgICAgICAgICAgICAgICAgICAgPGNiYzpJRD51cm46b2FzaXM6bmFtZXM6c3BlY2lmaWNhdGlvbjp1Ymw6c2lnbmF0dXJlOjE8L2NiYzpJRD4KICAgICAgICAgICAgICAgICAgICA8c2JjOlJlZmVyZW5jZWRTaWduYXR1cmVJRD51cm46b2FzaXM6bmFtZXM6c3BlY2lmaWNhdGlvbjp1Ymw6c2lnbmF0dXJlOkludm9pY2U8L3NiYzpSZWZlcmVuY2VkU2lnbmF0dXJlSUQ+CiAgICAgICAgICAgICAgICAgICAgPGRzOlNpZ25hdHVyZSB4bWxuczpkcz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnIyIgSWQ9InNpZ25hdHVyZSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxkczpTaWduZWRJbmZvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRzOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDA2LzEyL3htbC1jMTRuMTEiLz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkczpTaWduYXR1cmVNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNlY2RzYS1zaGEyNTYiLz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkczpSZWZlcmVuY2UgSWQ9Imludm9pY2VTaWduZWREYXRhIiBVUkk9IiI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRzOlRyYW5zZm9ybXM+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy9UUi8xOTk5L1JFQy14cGF0aC0xOTk5MTExNiI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHM6WFBhdGg+bm90KC8vYW5jZXN0b3Itb3Itc2VsZjo6ZXh0OlVCTEV4dGVuc2lvbnMpPC9kczpYUGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kczpUcmFuc2Zvcm0+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy9UUi8xOTk5L1JFQy14cGF0aC0xOTk5MTExNiI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHM6WFBhdGg+bm90KC8vYW5jZXN0b3Itb3Itc2VsZjo6Y2FjOlNpZ25hdHVyZSk8L2RzOlhQYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RzOlRyYW5zZm9ybT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnL1RSLzE5OTkvUkVDLXhwYXRoLTE5OTkxMTE2Ij4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkczpYUGF0aD5ub3QoLy9hbmNlc3Rvci1vci1zZWxmOjpjYWM6QWRkaXRpb25hbERvY3VtZW50UmVmZXJlbmNlW2NiYzpJRD0nUVInXSk8L2RzOlhQYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RzOlRyYW5zZm9ybT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDYvMTIveG1sLWMxNG4xMSIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZHM6VHJhbnNmb3Jtcz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxlbmMjc2hhMjU2Ii8+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRzOkRpZ2VzdFZhbHVlPmYrMFdDcW5Qa0luSStlTDlHM0xBcnkxMmZUUGYrdG9DOVVYMDdGNGZJK3M9PC9kczpEaWdlc3RWYWx1ZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZHM6UmVmZXJlbmNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRzOlJlZmVyZW5jZSBUeXBlPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjU2lnbmF0dXJlUHJvcGVydGllcyIgVVJJPSIjeGFkZXNTaWduZWRQcm9wZXJ0aWVzIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxlbmMjc2hhMjU2Ii8+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRzOkRpZ2VzdFZhbHVlPk9EUXdOVGcxTlRCaE1qTXpNMll4WTJaa1pqVmtZemRsTlRaaVpqWTBPREpqTWpOa1lXSTRNVFV6TmpkbU5EVmpNakF3WlRCak9EYzJZVE5oTVdRMU5nPT08L2RzOkRpZ2VzdFZhbHVlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kczpSZWZlcmVuY2U+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZHM6U2lnbmVkSW5mbz4KICAgICAgICAgICAgICAgICAgICAgICAgPGRzOlNpZ25hdHVyZVZhbHVlPk1FVUNJQnh5UjhyYzRLODcyOHdkU0Y0WFNEcVBzK3JJTCszVEZoOW0rYU54UVB0U0FpRUE2Y0hhcEl0dnAxM3lNU3U2Nk5iT2cyQ3BvbUh3VVNuWUo5aDZ1R1E2NWFZPTwvZHM6U2lnbmF0dXJlVmFsdWU+CiAgICAgICAgICAgICAgICAgICAgICAgIDxkczpLZXlJbmZvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRzOlg1MDlEYXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkczpYNTA5Q2VydGlmaWNhdGU+TUlJRDNqQ0NBNFNnQXdJQkFnSVRFUUFBT0FQRjkwQWpzL3hjWHdBQkFBQTRBekFLQmdncWhrak9QUVFEQWpCaU1SVXdFd1lLQ1pJbWlaUHlMR1FCR1JZRmJHOWpZV3d4RXpBUkJnb0praWFKay9Jc1pBRVpGZ05uYjNZeEZ6QVZCZ29Ka2lhSmsvSXNaQUVaRmdkbGVIUm5ZWHAwTVJzd0dRWURWUVFERXhKUVVscEZTVTVXVDBsRFJWTkRRVFF0UTBFd0hoY05NalF3TVRFeE1Ea3hPVE13V2hjTk1qa3dNVEE1TURreE9UTXdXakIxTVFzd0NRWURWUVFHRXdKVFFURW1NQ1FHQTFVRUNoTWRUV0Y0YVcxMWJTQlRjR1ZsWkNCVVpXTm9JRk4xY0hCc2VTQk1WRVF4RmpBVUJnTlZCQXNURFZKcGVXRmthQ0JDY21GdVkyZ3hKakFrQmdOVkJBTVRIVlJUVkMwNE9EWTBNekV4TkRVdE16azVPVGs1T1RrNU9UQXdNREF6TUZZd0VBWUhLb1pJemowQ0FRWUZLNEVFQUFvRFFnQUVvV0NLYTBTYTlGSUVyVE92MHVBa0MxVklLWHhVOW5QcHgydmxmNHloTWVqeThjMDJYSmJsRHE3dFB5ZG84bXEwYWhPTW1Obzhnd25pN1h0MUtUOVVlS09DQWdjd2dnSURNSUd0QmdOVkhSRUVnYVV3Z2FLa2daOHdnWnd4T3pBNUJnTlZCQVFNTWpFdFZGTlVmREl0VkZOVWZETXRaV1F5TW1ZeFpEZ3RaVFpoTWkweE1URTRMVGxpTlRndFpEbGhPR1l4TVdVME5EVm1NUjh3SFFZS0NaSW1pWlB5TEdRQkFRd1BNems1T1RrNU9UazVPVEF3TURBek1RMHdDd1lEVlFRTURBUXhNVEF3TVJFd0R3WURWUVFhREFoU1VsSkVNamt5T1RFYU1CZ0dBMVVFRHd3UlUzVndjR3g1SUdGamRHbDJhWFJwWlhNd0hRWURWUjBPQkJZRUZFWCtZdm1tdG5Zb0RmOUJHYktvN29jVEtZSzFNQjhHQTFVZEl3UVlNQmFBRkp2S3FxTHRtcXdza0lGelZ2cFAyUHhUKzlObk1Ic0dDQ3NHQVFVRkJ3RUJCRzh3YlRCckJnZ3JCZ0VGQlFjd0FvWmZhSFIwY0RvdkwyRnBZVFF1ZW1GMFkyRXVaMjkyTG5OaEwwTmxjblJGYm5KdmJHd3ZVRkphUlVsdWRtOXBZMlZUUTBFMExtVjRkR2RoZW5RdVoyOTJMbXh2WTJGc1gxQlNXa1ZKVGxaUFNVTkZVME5CTkMxRFFTZ3hLUzVqY25Rd0RnWURWUjBQQVFIL0JBUURBZ2VBTUR3R0NTc0dBUVFCZ2pjVkJ3UXZNQzBHSlNzR0FRUUJnamNWQ0lHR3FCMkUwUHNTaHUyZEpJZk8reG5Ud0ZWbWgvcWxaWVhaaEQ0Q0FXUUNBUkl3SFFZRFZSMGxCQll3RkFZSUt3WUJCUVVIQXdNR0NDc0dBUVVGQndNQ01DY0dDU3NHQVFRQmdqY1ZDZ1FhTUJnd0NnWUlLd1lCQlFVSEF3TXdDZ1lJS3dZQkJRVUhBd0l3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUloQUxFL2ljaG1uV1hDVUtVYmNhM3ljaThvcXdhTHZGZEhWalFydmVJOXVxQWJBaUE5aEM0TThqZ01CQURQU3ptZDJ1aVBKQTZnS1IzTEUwM1U3NWVxYkMvclhBPT08L2RzOlg1MDlDZXJ0aWZpY2F0ZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZHM6WDUwOURhdGE+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZHM6S2V5SW5mbz4KICAgICAgICAgICAgICAgICAgICAgICAgPGRzOk9iamVjdD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx4YWRlczpRdWFsaWZ5aW5nUHJvcGVydGllcyB4bWxuczp4YWRlcz0iaHR0cDovL3VyaS5ldHNpLm9yZy8wMTkwMy92MS4zLjIjIiBUYXJnZXQ9InNpZ25hdHVyZSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHhhZGVzOlNpZ25lZFByb3BlcnRpZXMgSWQ9InhhZGVzU2lnbmVkUHJvcGVydGllcyI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx4YWRlczpTaWduZWRTaWduYXR1cmVQcm9wZXJ0aWVzPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHhhZGVzOlNpZ25pbmdUaW1lPjIwMjQtMDEtMTRUMTA6MjE6NDA8L3hhZGVzOlNpZ25pbmdUaW1lPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHhhZGVzOlNpZ25pbmdDZXJ0aWZpY2F0ZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8eGFkZXM6Q2VydD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHhhZGVzOkNlcnREaWdlc3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxlbmMjc2hhMjU2Ii8+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHM6RGlnZXN0VmFsdWU+WkRNd01tSTBNVEUxTnpWak9UVTJOVGs0WXpWbE9EaGhZbUkwT0RVMk5EVXlOVFUyWVRWaFlqaGhNREZtTjJGallqazFZVEEyT1dRME5qWTJNalE0TlE9PTwvZHM6RGlnZXN0VmFsdWU+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwveGFkZXM6Q2VydERpZ2VzdD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHhhZGVzOklzc3VlclNlcmlhbD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkczpYNTA5SXNzdWVyTmFtZT5DTj1QUlpFSU5WT0lDRVNDQTQtQ0EsIERDPWV4dGdhenQsIERDPWdvdiwgREM9bG9jYWw8L2RzOlg1MDlJc3N1ZXJOYW1lPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRzOlg1MDlTZXJpYWxOdW1iZXI+Mzc5MTEyNzQyODMxMzgwNDcxODM1MjYzOTY5NTg3Mjg3NjYzNTIwNTI4Mzg3PC9kczpYNTA5U2VyaWFsTnVtYmVyPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3hhZGVzOklzc3VlclNlcmlhbD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3hhZGVzOkNlcnQ+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3hhZGVzOlNpZ25pbmdDZXJ0aWZpY2F0ZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC94YWRlczpTaWduZWRTaWduYXR1cmVQcm9wZXJ0aWVzPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwveGFkZXM6U2lnbmVkUHJvcGVydGllcz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwveGFkZXM6UXVhbGlmeWluZ1Byb3BlcnRpZXM+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZHM6T2JqZWN0PgogICAgICAgICAgICAgICAgICAgIDwvZHM6U2lnbmF0dXJlPgogICAgICAgICAgICAgICAgPC9zYWM6U2lnbmF0dXJlSW5mb3JtYXRpb24+CiAgICAgICAgICAgIDwvc2lnOlVCTERvY3VtZW50U2lnbmF0dXJlcz4KICAgICAgICA8L2V4dDpFeHRlbnNpb25Db250ZW50PgogICAgPC9leHQ6VUJMRXh0ZW5zaW9uPgo8L2V4dDpVQkxFeHRlbnNpb25zPgogICAgCiAgICA8Y2JjOlByb2ZpbGVJRD5yZXBvcnRpbmc6MS4wPC9jYmM6UHJvZmlsZUlEPgogICAgPGNiYzpJRD5TTUUwMDAyMzwvY2JjOklEPgogICAgPGNiYzpVVUlEPjhkNDg3ODE2LTcwYjgtNGFkZS1hNjE4LTlkNjIwYjczODE0YTwvY2JjOlVVSUQ+CiAgICA8Y2JjOklzc3VlRGF0ZT4yMDIyLTA5LTA3PC9jYmM6SXNzdWVEYXRlPgogICAgPGNiYzpJc3N1ZVRpbWU+MTI6MjE6Mjg8L2NiYzpJc3N1ZVRpbWU+CiAgICA8Y2JjOkludm9pY2VUeXBlQ29kZSBuYW1lPSIwMTAwMDAwIj4zODg8L2NiYzpJbnZvaWNlVHlwZUNvZGU+CiAgICA8Y2JjOkRvY3VtZW50Q3VycmVuY3lDb2RlPlNBUjwvY2JjOkRvY3VtZW50Q3VycmVuY3lDb2RlPgogICAgPGNiYzpUYXhDdXJyZW5jeUNvZGU+U0FSPC9jYmM6VGF4Q3VycmVuY3lDb2RlPgogICAgPGNhYzpBZGRpdGlvbmFsRG9jdW1lbnRSZWZlcmVuY2U+CiAgICAgICAgPGNiYzpJRD5JQ1Y8L2NiYzpJRD4KICAgICAgICA8Y2JjOlVVSUQ+MjM8L2NiYzpVVUlEPgogICAgPC9jYWM6QWRkaXRpb25hbERvY3VtZW50UmVmZXJlbmNlPgogICAgPGNhYzpBZGRpdGlvbmFsRG9jdW1lbnRSZWZlcmVuY2U+CiAgICAgICAgPGNiYzpJRD5QSUg8L2NiYzpJRD4KICAgICAgICA8Y2FjOkF0dGFjaG1lbnQ+CiAgICAgICAgICAgIDxjYmM6RW1iZWRkZWREb2N1bWVudEJpbmFyeU9iamVjdCBtaW1lQ29kZT0idGV4dC9wbGFpbiI+TldabFkyVmlOalptWm1NNE5tWXpPR1E1TlRJM09EWmpObVEyT1Raak56bGpNbVJpWXpJek9XUmtOR1U1TVdJME5qY3lPV1EzTTJFeU4yWmlOVGRsT1E9PTwvY2JjOkVtYmVkZGVkRG9jdW1lbnRCaW5hcnlPYmplY3Q+CiAgICAgICAgPC9jYWM6QXR0YWNobWVudD4KICAgIDwvY2FjOkFkZGl0aW9uYWxEb2N1bWVudFJlZmVyZW5jZT4KICAgIAogICAgCiAgICA8Y2FjOkFkZGl0aW9uYWxEb2N1bWVudFJlZmVyZW5jZT4KICAgICAgICA8Y2JjOklEPlFSPC9jYmM6SUQ+CiAgICAgICAgPGNhYzpBdHRhY2htZW50PgogICAgICAgICAgICA8Y2JjOkVtYmVkZGVkRG9jdW1lbnRCaW5hcnlPYmplY3QgbWltZUNvZGU9InRleHQvcGxhaW4iPkFXL1l0Tml4MllQWXFTRFlxdG1JMkxIWml0aXZJTmluMllUWXF0bUQyWWJaaU5tRTJZallyTm1LMktjZzJLallvOW1DMkxYWmlTRFlzOWl4MkxuWXFTRFlwOW1FMllYWXJkaXYyWWpZcjlpcElId2dUV0Y0YVcxMWJTQlRjR1ZsWkNCVVpXTm9JRk4xY0hCc2VTQk1WRVFDRHpNNU9UazVPVGs1T1Rrd01EQXdNd01UTWpBeU1pMHdPUzB3TjFReE1qb3lNVG95T0FRRU5DNDJNQVVETUM0MkJpeG1LekJYUTNGdVVHdEpia2tyWlV3NVJ6Tk1RWEo1TVRKbVZGQm1LM1J2UXpsVldEQTNSalJtU1N0elBRZGdUVVZWUTBsQ2VIbFNPSEpqTkVzNE56STRkMlJUUmpSWVUwUnhVSE1yY2tsTUt6TlVSbWc1YlN0aFRuaFJVSFJUUVdsRlFUWmpTR0Z3U1hSMmNERXplVTFUZFRZMlRtSlBaekpEY0c5dFNIZFZVMjVaU2psb05uVkhVVFkxWVZrOUNGZ3dWakFRQmdjcWhrak9QUUlCQmdVcmdRUUFDZ05DQUFTaFlJcHJSSnIwVWdTdE02L1M0Q1FMVlVncGZGVDJjK25IYStWL2pLRXg2UEx4elRaY2x1VU9ydTAvSjJqeWFyUnFFNHlZMmp5RENlTHRlM1VwUDFSNDwvY2JjOkVtYmVkZGVkRG9jdW1lbnRCaW5hcnlPYmplY3Q+CiAgICAgICAgPC9jYWM6QXR0YWNobWVudD4KPC9jYWM6QWRkaXRpb25hbERvY3VtZW50UmVmZXJlbmNlPjxjYWM6U2lnbmF0dXJlPgogICAgICA8Y2JjOklEPnVybjpvYXNpczpuYW1lczpzcGVjaWZpY2F0aW9uOnVibDpzaWduYXR1cmU6SW52b2ljZTwvY2JjOklEPgogICAgICA8Y2JjOlNpZ25hdHVyZU1ldGhvZD51cm46b2FzaXM6bmFtZXM6c3BlY2lmaWNhdGlvbjp1Ymw6ZHNpZzplbnZlbG9wZWQ6eGFkZXM8L2NiYzpTaWduYXR1cmVNZXRob2Q+CjwvY2FjOlNpZ25hdHVyZT48Y2FjOkFjY291bnRpbmdTdXBwbGllclBhcnR5PgogICAgICAgIDxjYWM6UGFydHk+CiAgICAgICAgICAgIDxjYWM6UGFydHlJZGVudGlmaWNhdGlvbj4KICAgICAgICAgICAgICAgIDxjYmM6SUQgc2NoZW1lSUQ9IkNSTiI+MTAxMDAxMDAwMDwvY2JjOklEPgogICAgICAgICAgICA8L2NhYzpQYXJ0eUlkZW50aWZpY2F0aW9uPgogICAgICAgICAgICA8Y2FjOlBvc3RhbEFkZHJlc3M+CiAgICAgICAgICAgICAgICA8Y2JjOlN0cmVldE5hbWU+2KfZhNin2YXZitixINiz2YTYt9in2YYgfCBQcmluY2UgU3VsdGFuPC9jYmM6U3RyZWV0TmFtZT4KICAgICAgICAgICAgICAgIDxjYmM6QnVpbGRpbmdOdW1iZXI+MjMyMjwvY2JjOkJ1aWxkaW5nTnVtYmVyPgogICAgICAgICAgICAgICAgPGNiYzpDaXR5U3ViZGl2aXNpb25OYW1lPtin2YTZhdix2KjYuSB8IEFsLU11cmFiYmE8L2NiYzpDaXR5U3ViZGl2aXNpb25OYW1lPgogICAgICAgICAgICAgICAgPGNiYzpDaXR5TmFtZT7Yp9mE2LHZitin2LYgfCBSaXlhZGg8L2NiYzpDaXR5TmFtZT4KICAgICAgICAgICAgICAgIDxjYmM6UG9zdGFsWm9uZT4yMzMzMzwvY2JjOlBvc3RhbFpvbmU+CiAgICAgICAgICAgICAgICA8Y2FjOkNvdW50cnk+CiAgICAgICAgICAgICAgICAgICAgPGNiYzpJZGVudGlmaWNhdGlvbkNvZGU+U0E8L2NiYzpJZGVudGlmaWNhdGlvbkNvZGU+CiAgICAgICAgICAgICAgICA8L2NhYzpDb3VudHJ5PgogICAgICAgICAgICA8L2NhYzpQb3N0YWxBZGRyZXNzPgogICAgICAgICAgICA8Y2FjOlBhcnR5VGF4U2NoZW1lPgogICAgICAgICAgICAgICAgPGNiYzpDb21wYW55SUQ+Mzk5OTk5OTk5OTAwMDAzPC9jYmM6Q29tcGFueUlEPgogICAgICAgICAgICAgICAgPGNhYzpUYXhTY2hlbWU+CiAgICAgICAgICAgICAgICAgICAgPGNiYzpJRD5WQVQ8L2NiYzpJRD4KICAgICAgICAgICAgICAgIDwvY2FjOlRheFNjaGVtZT4KICAgICAgICAgICAgPC9jYWM6UGFydHlUYXhTY2hlbWU+CiAgICAgICAgICAgIDxjYWM6UGFydHlMZWdhbEVudGl0eT4KICAgICAgICAgICAgICAgIDxjYmM6UmVnaXN0cmF0aW9uTmFtZT7YtNix2YPYqSDYqtmI2LHZitivINin2YTYqtmD2YbZiNmE2YjYrNmK2Kcg2KjYo9mC2LXZiSDYs9ix2LnYqSDYp9mE2YXYrdiv2YjYr9ipIHwgTWF4aW11bSBTcGVlZCBUZWNoIFN1cHBseSBMVEQ8L2NiYzpSZWdpc3RyYXRpb25OYW1lPgogICAgICAgICAgICA8L2NhYzpQYXJ0eUxlZ2FsRW50aXR5PgogICAgICAgIDwvY2FjOlBhcnR5PgogICAgPC9jYWM6QWNjb3VudGluZ1N1cHBsaWVyUGFydHk+CiAgICAgPGNhYzpBY2NvdW50aW5nQ3VzdG9tZXJQYXJ0eT4KICAgICAgICA8Y2FjOlBhcnR5PgogICAgICAgICAgICA8Y2FjOlBvc3RhbEFkZHJlc3M+CiAgICAgICAgICAgICAgICA8Y2JjOlN0cmVldE5hbWU+2LXZhNin2K0g2KfZhNiv2YrZhiB8IFNhbGFoIEFsLURpbjwvY2JjOlN0cmVldE5hbWU+CiAgICAgICAgICAgICAgICA8Y2JjOkJ1aWxkaW5nTnVtYmVyPjExMTE8L2NiYzpCdWlsZGluZ051bWJlcj4KICAgICAgICAgICAgICAgIDxjYmM6Q2l0eVN1YmRpdmlzaW9uTmFtZT7Yp9mE2YXYsdmI2KwgfCBBbC1NdXJvb2o8L2NiYzpDaXR5U3ViZGl2aXNpb25OYW1lPgogICAgICAgICAgICAgICAgPGNiYzpDaXR5TmFtZT7Yp9mE2LHZitin2LYgfCBSaXlhZGg8L2NiYzpDaXR5TmFtZT4KICAgICAgICAgICAgICAgIDxjYmM6UG9zdGFsWm9uZT4xMjIyMjwvY2JjOlBvc3RhbFpvbmU+CiAgICAgICAgICAgICAgICA8Y2FjOkNvdW50cnk+CiAgICAgICAgICAgICAgICAgICAgPGNiYzpJZGVudGlmaWNhdGlvbkNvZGU+U0E8L2NiYzpJZGVudGlmaWNhdGlvbkNvZGU+CiAgICAgICAgICAgICAgICA8L2NhYzpDb3VudHJ5PgogICAgICAgICAgICA8L2NhYzpQb3N0YWxBZGRyZXNzPgogICAgICAgICAgICA8Y2FjOlBhcnR5VGF4U2NoZW1lPgogICAgICAgICAgICAgICAgPGNiYzpDb21wYW55SUQ+Mzk5OTk5OTk5ODAwMDAzPC9jYmM6Q29tcGFueUlEPgogICAgICAgICAgICAgICAgPGNhYzpUYXhTY2hlbWU+CiAgICAgICAgICAgICAgICAgICAgPGNiYzpJRD5WQVQ8L2NiYzpJRD4KICAgICAgICAgICAgICAgIDwvY2FjOlRheFNjaGVtZT4KICAgICAgICAgICAgPC9jYWM6UGFydHlUYXhTY2hlbWU+CiAgICAgICAgICAgIDxjYWM6UGFydHlMZWdhbEVudGl0eT4KICAgICAgICAgICAgICAgIDxjYmM6UmVnaXN0cmF0aW9uTmFtZT7YtNix2YPYqSDZhtmF2KfYsNisINmB2KfYqtmI2LHYqSDYp9mE2YXYrdiv2YjYr9ipIHwgRmF0b29yYSBTYW1wbGVzIExURDwvY2JjOlJlZ2lzdHJhdGlvbk5hbWU+CiAgICAgICAgICAgIDwvY2FjOlBhcnR5TGVnYWxFbnRpdHk+CiAgICAgICAgPC9jYWM6UGFydHk+CiAgICA8L2NhYzpBY2NvdW50aW5nQ3VzdG9tZXJQYXJ0eT4KICAgIDxjYWM6RGVsaXZlcnk+CiAgICAgICAgPGNiYzpBY3R1YWxEZWxpdmVyeURhdGU+MjAyMi0wOS0wNzwvY2JjOkFjdHVhbERlbGl2ZXJ5RGF0ZT4KICAgIDwvY2FjOkRlbGl2ZXJ5PgogICAgPGNhYzpQYXltZW50TWVhbnM+CiAgICAgICAgPGNiYzpQYXltZW50TWVhbnNDb2RlPjEwPC9jYmM6UGF5bWVudE1lYW5zQ29kZT4KICAgIDwvY2FjOlBheW1lbnRNZWFucz4KICAgIDxjYWM6QWxsb3dhbmNlQ2hhcmdlPgogICAgICAgIDxjYmM6Q2hhcmdlSW5kaWNhdG9yPmZhbHNlPC9jYmM6Q2hhcmdlSW5kaWNhdG9yPgogICAgICAgIDxjYmM6QWxsb3dhbmNlQ2hhcmdlUmVhc29uPmRpc2NvdW50PC9jYmM6QWxsb3dhbmNlQ2hhcmdlUmVhc29uPgogICAgICAgIDxjYmM6QW1vdW50IGN1cnJlbmN5SUQ9IlNBUiI+MC4wMDwvY2JjOkFtb3VudD4KICAgICAgICA8Y2FjOlRheENhdGVnb3J5PgogICAgICAgICAgICA8Y2JjOklEIHNjaGVtZUlEPSJVTi9FQ0UgNTMwNSIgc2NoZW1lQWdlbmN5SUQ9IjYiPlM8L2NiYzpJRD4KICAgICAgICAgICAgPGNiYzpQZXJjZW50PjE1PC9jYmM6UGVyY2VudD4KICAgICAgICAgICAgPGNhYzpUYXhTY2hlbWU+CiAgICAgICAgICAgICAgICA8Y2JjOklEIHNjaGVtZUlEPSJVTi9FQ0UgNTE1MyIgc2NoZW1lQWdlbmN5SUQ9IjYiPlZBVDwvY2JjOklEPgogICAgICAgICAgICA8L2NhYzpUYXhTY2hlbWU+CiAgICAgICAgPC9jYWM6VGF4Q2F0ZWdvcnk+CiAgICA8L2NhYzpBbGxvd2FuY2VDaGFyZ2U+CiAgICA8Y2FjOlRheFRvdGFsPgogICAgICAgIDxjYmM6VGF4QW1vdW50IGN1cnJlbmN5SUQ9IlNBUiI+MC42PC9jYmM6VGF4QW1vdW50PgogICAgPC9jYWM6VGF4VG90YWw+CiAgICA8Y2FjOlRheFRvdGFsPgogICAgICAgIDxjYmM6VGF4QW1vdW50IGN1cnJlbmN5SUQ9IlNBUiI+MC42PC9jYmM6VGF4QW1vdW50PgogICAgICAgIDxjYWM6VGF4U3VidG90YWw+CiAgICAgICAgICAgIDxjYmM6VGF4YWJsZUFtb3VudCBjdXJyZW5jeUlEPSJTQVIiPjQuMDA8L2NiYzpUYXhhYmxlQW1vdW50PgogICAgICAgICAgICA8Y2JjOlRheEFtb3VudCBjdXJyZW5jeUlEPSJTQVIiPjAuNjA8L2NiYzpUYXhBbW91bnQ+CiAgICAgICAgICAgICA8Y2FjOlRheENhdGVnb3J5PgogICAgICAgICAgICAgICAgIDxjYmM6SUQgc2NoZW1lSUQ9IlVOL0VDRSA1MzA1IiBzY2hlbWVBZ2VuY3lJRD0iNiI+UzwvY2JjOklEPgogICAgICAgICAgICAgICAgIDxjYmM6UGVyY2VudD4xNS4wMDwvY2JjOlBlcmNlbnQ+CiAgICAgICAgICAgICAgICA8Y2FjOlRheFNjaGVtZT4KICAgICAgICAgICAgICAgICAgIDxjYmM6SUQgc2NoZW1lSUQ9IlVOL0VDRSA1MTUzIiBzY2hlbWVBZ2VuY3lJRD0iNiI+VkFUPC9jYmM6SUQ+CiAgICAgICAgICAgICAgICA8L2NhYzpUYXhTY2hlbWU+CiAgICAgICAgICAgICA8L2NhYzpUYXhDYXRlZ29yeT4KICAgICAgICA8L2NhYzpUYXhTdWJ0b3RhbD4KICAgIDwvY2FjOlRheFRvdGFsPgogICAgPGNhYzpMZWdhbE1vbmV0YXJ5VG90YWw+CiAgICAgICAgPGNiYzpMaW5lRXh0ZW5zaW9uQW1vdW50IGN1cnJlbmN5SUQ9IlNBUiI+NC4wMDwvY2JjOkxpbmVFeHRlbnNpb25BbW91bnQ+CiAgICAgICAgPGNiYzpUYXhFeGNsdXNpdmVBbW91bnQgY3VycmVuY3lJRD0iU0FSIj40LjAwPC9jYmM6VGF4RXhjbHVzaXZlQW1vdW50PgogICAgICAgIDxjYmM6VGF4SW5jbHVzaXZlQW1vdW50IGN1cnJlbmN5SUQ9IlNBUiI+NC42MDwvY2JjOlRheEluY2x1c2l2ZUFtb3VudD4KICAgICAgICA8Y2JjOkFsbG93YW5jZVRvdGFsQW1vdW50IGN1cnJlbmN5SUQ9IlNBUiI+MC4wMDwvY2JjOkFsbG93YW5jZVRvdGFsQW1vdW50PgogICAgICAgIDxjYmM6UHJlcGFpZEFtb3VudCBjdXJyZW5jeUlEPSJTQVIiPjAuMDA8L2NiYzpQcmVwYWlkQW1vdW50PgogICAgICAgIDxjYmM6UGF5YWJsZUFtb3VudCBjdXJyZW5jeUlEPSJTQVIiPjQuNjA8L2NiYzpQYXlhYmxlQW1vdW50PgogICAgPC9jYWM6TGVnYWxNb25ldGFyeVRvdGFsPgogICAgPGNhYzpJbnZvaWNlTGluZT4KICAgICAgICA8Y2JjOklEPjE8L2NiYzpJRD4KICAgICAgICA8Y2JjOkludm9pY2VkUXVhbnRpdHkgdW5pdENvZGU9IlBDRSI+Mi4wMDAwMDA8L2NiYzpJbnZvaWNlZFF1YW50aXR5PgogICAgICAgIDxjYmM6TGluZUV4dGVuc2lvbkFtb3VudCBjdXJyZW5jeUlEPSJTQVIiPjQuMDA8L2NiYzpMaW5lRXh0ZW5zaW9uQW1vdW50PgogICAgICAgIDxjYWM6VGF4VG90YWw+CiAgICAgICAgICAgICA8Y2JjOlRheEFtb3VudCBjdXJyZW5jeUlEPSJTQVIiPjAuNjA8L2NiYzpUYXhBbW91bnQ+CiAgICAgICAgICAgICA8Y2JjOlJvdW5kaW5nQW1vdW50IGN1cnJlbmN5SUQ9IlNBUiI+NC42MDwvY2JjOlJvdW5kaW5nQW1vdW50PgogICAgICAgIDwvY2FjOlRheFRvdGFsPgogICAgICAgIDxjYWM6SXRlbT4KICAgICAgICAgICAgPGNiYzpOYW1lPtmC2YTZhSDYsdi12KfYtTwvY2JjOk5hbWU+CiAgICAgICAgICAgIDxjYWM6Q2xhc3NpZmllZFRheENhdGVnb3J5PgogICAgICAgICAgICAgICAgPGNiYzpJRD5TPC9jYmM6SUQ+CiAgICAgICAgICAgICAgICA8Y2JjOlBlcmNlbnQ+MTUuMDA8L2NiYzpQZXJjZW50PgogICAgICAgICAgICAgICAgPGNhYzpUYXhTY2hlbWU+CiAgICAgICAgICAgICAgICAgICAgPGNiYzpJRD5WQVQ8L2NiYzpJRD4KICAgICAgICAgICAgICAgIDwvY2FjOlRheFNjaGVtZT4KICAgICAgICAgICAgPC9jYWM6Q2xhc3NpZmllZFRheENhdGVnb3J5PgogICAgICAgIDwvY2FjOkl0ZW0+CiAgICAgICAgPGNhYzpQcmljZT4KICAgICAgICAgICAgPGNiYzpQcmljZUFtb3VudCBjdXJyZW5jeUlEPSJTQVIiPjIuMDA8L2NiYzpQcmljZUFtb3VudD4KICAgICAgICAgICAgPGNhYzpBbGxvd2FuY2VDaGFyZ2U+CiAgICAgICAgICAgICAgIDxjYmM6Q2hhcmdlSW5kaWNhdG9yPnRydWU8L2NiYzpDaGFyZ2VJbmRpY2F0b3I+CiAgICAgICAgICAgICAgIDxjYmM6QWxsb3dhbmNlQ2hhcmdlUmVhc29uPmRpc2NvdW50PC9jYmM6QWxsb3dhbmNlQ2hhcmdlUmVhc29uPgogICAgICAgICAgICAgICA8Y2JjOkFtb3VudCBjdXJyZW5jeUlEPSJTQVIiPjAuMDA8L2NiYzpBbW91bnQ+CiAgICAgICAgICAgIDwvY2FjOkFsbG93YW5jZUNoYXJnZT4KICAgICAgICA8L2NhYzpQcmljZT4KICAgIDwvY2FjOkludm9pY2VMaW5lPgo8L0ludm9pY2U+",
      //   },
      //   { headers: { ...auth_headers, ...headers } }
      // );

      const response = await axios.post(
        `${settings.SANDBOX_BASEURL}/invoices/clearance/single`,
        {
          invoiceHash: invoice_hash,
          uuid: egs_uuid,
          invoice: Buffer.from(signed_xml_string).toString("base64"),
        },
        { headers: { ...auth_headers, ...headers } }
      );

      if (response.status != 200) {
        console.log(response);
        throw new Error("Error in reporting invoice.");
      }
      return response.data;
    };

    return {
      issueCertificate,
      reportInvoice,
    };
  }
}

export default API;
