// Sample line item// 2.2.2 Profile specification of the Cryptographic Stamp identifiers. & CSR field contents / RDNs.
import { spawn } from "child_process";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
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
  egs_model: string;
  egs_serial_number: string;
  solution_name: string;
  vat_number: string;
  branch_location: string;
  branch_industry: string;
  branch_name: string;
  taxpayer_name: string;
  taxpayer_provided_id: string;
} 


export default function defaultCSRConfig(props: CSRConfigProps): string {
  let populated_template = template;
  populated_template = populated_template.replace(
    "SET_PRIVATE_KEY_PASS",
    props.private_key_pass ?? "SET_PRIVATE_KEY_PASS"
  );
  populated_template = populated_template.replace(
    "SET_PRODUCTION_VALUE",
    props.production ? "ZATCA-Code-Signing" : "TSTZATCA-Code-Signing"
  );
  populated_template = populated_template.replace(
    "SET_EGS_SERIAL_NUMBER",
    `1-${props.solution_name}|2-${props.egs_model}|3-${props.egs_serial_number}`
  );
  populated_template = populated_template.replace(
    "SET_VAT_REGISTRATION_NUMBER",
    props.vat_number
  );
  populated_template = populated_template.replace(
    "SET_BRANCH_LOCATION",
    props.branch_location
  );
  populated_template = populated_template.replace(
    "SET_BRANCH_INDUSTRY",
    props.branch_industry
  );
  populated_template = populated_template.replace(
    "SET_COMMON_NAME",
    props.taxpayer_provided_id
  );
  populated_template = populated_template.replace(
    "SET_BRANCH_NAME",
    props.branch_name
  );
  populated_template = populated_template.replace(
    "SET_TAXPAYER_NAME",
    props.taxpayer_name
  );

  return populated_template;
}

export interface ZATCASimplifiedInvoiceLineItemTax {
  percent_amount: number;
}
export interface ZATCASimplifiedInvoiceLineItemDiscount {
  amount: number;
  reason: string;
}
export interface ZATCASimplifiedInvoiceLineItem {
  id: string;
  name: string;
  quantity: number;
  tax_exclusive_price: number;
  other_taxes?: ZATCASimplifiedInvoiceLineItemTax[];
  discounts?: ZATCASimplifiedInvoiceLineItemDiscount[];
  VAT_percent: number;
}

const line_item: ZATCASimplifiedInvoiceLineItem = {
  id: "1",
  name: "TEST NAME",
  quantity: 5,
  tax_exclusive_price: 10,
  VAT_percent: 0.15,
  other_taxes: [{ percent_amount: 1 }],
  discounts: [
    { amount: 2, reason: "A discount" },
    { amount: 2, reason: "A second discount" },
  ],
};

//

export interface EGSUnitLocation {
  city: string;
  city_subdivision: string;
  street: string;
  plot_identification: string;
  building: string;
  postal_zone: string;
}

export interface EGSUnitInfo {
  uuid: string;
  custom_id: string;
  model: string;
  CRN_number: string;
  VAT_name: string;
  VAT_number: string;
  branch_name: string;
  branch_industry: string;
  location: EGSUnitLocation;

  private_key?: string;
  csr?: string;
  compliance_certificate?: string;
  compliance_api_secret?: string;
  production_certificate?: string;
  production_api_secret?: string;
}

// Sample Invoice
// const invoice = new ZATCASimplifiedTaxInvoice({
//     props: {
//         egs_info: egsunit,
//         invoice_counter_number: 1,
//         invoice_serial_number: "EGS1-886431145-1",
//         issue_date: "2022-03-13",
//         issue_time: "14:40:40",
//         previous_invoice_hash: "NWZlY2ViNjZmZmM4NmYzOGQ5NTI3ODZjNmQ2OTZjNzljMmRiYzIzOWRkNGU5MWI0NjcyOWQ3M2EyN2ZiNTdlOQ==",
//         line_items: [
//             line_item,
//             line_item,
//             line_item
//         ]
//     }
// });

const OpenSSL = (cmd: string[]): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      const command = spawn("openssl", cmd);
      let result = "";
      command.stdout.on("data", (data) => {
        result += data.toString();
      });
      command.on("close", (code: number) => {
        return resolve(result);
      });
      command.on("error", (error: any) => {
        return reject(error);
      });
    } catch (error: any) {
      reject(error);
    }
  });
};const generateCSR = async (
  egs_info: EGSUnitInfo,
  production: boolean,
  solution_name: string
): Promise<string> => {
  if (!egs_info.private_key) throw new Error("EGS has no private key");
  const private_key_file = `${
    process.env.TEMP_FOLDER ?? "/tmp/"
  }${uuidv4()}.pem`;
  const csr_config_file = `${
    process.env.TEMP_FOLDER ?? "/tmp/"
  }${uuidv4()}.cnf`;
  fs.writeFileSync(private_key_file, egs_info.private_key);
  fs.writeFileSync(
    csr_config_file,
    defaultCSRConfig({
      egs_model: egs_info.model,
      egs_serial_number: egs_info.uuid,
      solution_name: solution_name,
      vat_number: egs_info.VAT_number,
      branch_location: `${egs_info.location.building} ${egs_info.location.street}, ${egs_info.location.city}`,
      branch_industry: egs_info.branch_industry,
      branch_name: egs_info.branch_name,
      taxpayer_name: egs_info.VAT_name,
      taxpayer_provided_id: egs_info.custom_id,
      production: production,
    })
  );

  const cleanUp = () => {
    fs.unlink(private_key_file, () => {});
    fs.unlink(csr_config_file, () => {});
  };

  try {
    const result = await OpenSSL([
      "req",
      "-new",
      "-sha256",
      "-key",
      private_key_file,
      "-config",
      csr_config_file,
    ]);
    if (!result.includes("-----BEGIN CERTIFICATE REQUEST-----"))
      throw new Error("Error no CSR found in OpenSSL output.");

    let csr: string = `-----BEGIN CERTIFICATE REQUEST-----${
      result.split("-----BEGIN CERTIFICATE REQUEST-----")[1]
    }`.trim();
    cleanUp();
    return csr;
  } catch (error) {
    cleanUp();
    throw error;
  }
};


const generateSecp256k1KeyPair = async (): Promise<string> => {
  try {
    const result = await OpenSSL(["ecparam", "-name", "secp256k1", "-genkey"]);
    if (!result.includes("-----BEGIN EC PRIVATE KEY-----"))
      throw new Error("Error no private key found in OpenSSL output.");

    let private_key: string = `-----BEGIN EC PRIVATE KEY-----${
      result.split("-----BEGIN EC PRIVATE KEY-----")[1]
    }`.trim();
    return private_key;
  } catch (error) {
    throw error;
  }
};


export class EGS {
  private egs_info: EGSUnitInfo;
  //   private api: API;

  constructor(egs_info: EGSUnitInfo) {
    this.egs_info = egs_info;
    // this.api = new API();
  }

  /**
   * @returns EGSUnitInfo
   */
  get() {
    return this.egs_info;
  }

  /**
   * Sets/Updates an EGS info field.
   * @param egs_info Partial<EGSUnitInfo>
   */
  set(egs_info: Partial<EGSUnitInfo>) {
    this.egs_info = { ...this.egs_info, ...egs_info };
  }

  /**
   * Generates a new secp256k1 Public/Private key pair for the EGS.
   * Also generates and signs a new CSR.
   * Note: This functions uses OpenSSL thus requires it to be installed on whatever system the package is running in.
   * @param production Boolean CSR or Compliance CSR
   * @param solution_name String name of solution generating certs.
   * @returns Promise void on success, throws error on fail.
   */
  async generateNewKeysAndCSR(production: boolean, solution_name: string) {
    try {
      const new_private_key = await generateSecp256k1KeyPair();
      this.egs_info.private_key = new_private_key;

      const new_csr = await generateCSR(
        this.egs_info,
        production,
        solution_name
      );
    
      this.egs_info.csr = new_csr;
      console.log(new_csr)
    } catch (error) {
      throw error;
    }
  }
}

const egsunit: EGSUnitInfo = {
  uuid: "6f4d20e0-6bfe-4a80-9389-7dabe6620f12",
  custom_id: "EGS1-886431145",
  model: "IOS",
  CRN_number: "454634645645654",
  VAT_name: "Wesam Alzahir",
  VAT_number: "301121971500003",
  location: {
    city: "Khobar",
    city_subdivision: "West",
    street: "King Fahahd st",
    plot_identification: "0000",
    building: "0000",
    postal_zone: "31952",
  },
  branch_name: "My Branch Name",
  branch_industry: "Food",
};

const egs = new EGS(egsunit);
const a = async () => await egs.generateNewKeysAndCSR(false, "solution_name");

a();