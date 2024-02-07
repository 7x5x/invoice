  // const QRCode = require("qrcode");

  // const getTLV = (tagName, tagValue) => {
  //   const tagBuf = Buffer.from(tagName, "utf8");
  //   const tagValueLenBuf = Buffer.from([tagValue.length], "utf8");
  //   const tagValueBuf = Buffer.from(tagValue, "utf8");
  //  const bufArray = [tagBuf, tagValueLenBuf, tagValueBuf];
  //  return Buffer.concat(bufArray);
  // };
  // const QrTags = {
  //   SellerName: {"Nassaco":"aa"},
  //   VATnummber: "100025906700003",
  //   TimeStamp: "2024-1-24T15:30:00z",
  //   InvoiceAmount: "2100100.99",
  //   VATAmount: "315015.15",
  //   InvoiceHash: "",
  //   ECDSAsignature: "",
  //   ECDSApublickey: "",
  // };

  // const tagsBuArray2 = Object.entries(QrTags).map(
  //   ([tagLabel, tagValue], tagName) => getTLsV((tagName + 1).toString(), tagValue)
  // );
  // var qr2 = Buffer.concat(tagsBuArray2);
  // async function generateQRCode() {
  //   try {
  //     await QRCode.toFile("E-InvoiceQRcode.png", qr2.toString("base64"), {
  //       width: 200,
  //       errorCorrectionLevel: "H",
  //     });

  //     console.log("QR code generated successfully.");
  //   } catch (error) {
  //     console.error("Error generating QR code:", error);
  //   }
  // }
  // generateQRCode().catch(console.error);
  console.log("sasas");

  const template = `
  # ------------------------------------------------------------------
  # Default section for "req" command options
  # ------------------------------------------------------------------
  [req]

  # Password for reading in existing private key file
  # input_password = SET_PRIVATE_KEY_PASS

  # Prompt for DN field values and CSR attributes in ASCII
  prompt = no
  utf8 = no

  # Section pointer for DN field options
  distinguished_name = my_req_dn_prompt

  # Extensions
  req_extensions = v3_req

  [ v3_req ]
  #basicConstraints=CA:FALSE
  #keyUsage = digitalSignature, keyEncipherment
  # Production or Testing Template (TSTZATCA-Code-Signing - ZATCA-Code-Signing)
  1.3.6.1.4.1.311.20.2 = ASN1:UTF8String:SET_PRODUCTION_VALUE
  subjectAltName=dirName:dir_sect

  [ dir_sect ]
  # EGS Serial number (1-SolutionName|2-ModelOrVersion|3-serialNumber)
  SN = SET_EGS_SERIAL_NUMBER
  # VAT Registration number of TaxPayer (Organization identifier [15 digits begins with 3 and ends with 3])
  UID = SET_VAT_REGISTRATION_NUMBER
  # Invoice type (TSCZ)(1 = supported, 0 not supported) (Tax, Simplified, future use, future use)
  title = 0100
  # Location (branch address or website)
  registeredAddress = SET_BRANCH_LOCATION
  # Industry (industry sector name)
  businessCategory = SET_BRANCH_INDUSTRY

  # ------------------------------------------------------------------
  # Section for prompting DN field values to create "subject"
  # ------------------------------------------------------------------
  [my_req_dn_prompt]
  # Common name (EGS TaxPayer PROVIDED ID [FREE TEXT])
  commonName = SET_COMMON_NAME

  # Organization Unit (Branch name)
  organizationalUnitName = SET_BRANCH_NAME

  # Organization name (Tax payer name)
  organizationName = SET_TAXPAYER_NAME

  # ISO2 country code is required with US as default
  countryName = SA
  `;

  interface CSRConfigProps {
    private_key_pass?: string;
    production?: boolean;
    egs_model?: string;
    egs_serial_number?: string;
    solution_name?: string;
    vat_number?: string;
    branch_location?: string;
    branch_industry?: string;
    branch_name?: string;
      taxpayer_name?: string;
      taxpayer_provided_id?: string;
}
    

    const main = (x: CSRConfigProps): any => {

      console.log(x.private_key_pass);
    };

    console.log(7);

    main({ private_key_pass: "" });
