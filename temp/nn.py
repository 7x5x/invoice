template = """
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
"""
# from Crypto.PublicKey import RSA  # provided by pycryptodome
import base64
# from Crypto.Cipher import AES
import rsa
from cryptography.hazmat.primitives import serialization
from typing import Optional
# from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend
# from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding

class CSRConfigProps:
    def __init__(
        self,
        egs_model: str,
        egs_serial_number: str,
        solution_name: str,
        vat_number: str,
        branch_location: str,
        branch_industry: str,
        branch_name: str,
        taxpayer_name: str,
        taxpayer_provided_id: str,
        private_key_pass: Optional[str] = None,
        production: Optional[bool] = None
    ):
        self.private_key_pass = private_key_pass
        self.production = production
        self.egs_model = egs_model
        self.egs_serial_number = egs_serial_number
        self.solution_name = solution_name
        self.vat_number = vat_number
        self.branch_location = branch_location
        self.branch_industry = branch_industry
        self.branch_name = branch_name
        self.taxpayer_name = taxpayer_name
        self.taxpayer_provided_id = taxpayer_provided_id

def populate(props:CSRConfigProps):
    populated_template = template
    populated_template = populated_template.replace(
    "SET_PRIVATE_KEY_PASS",
    props.private_key_pass if props.private_key_pass is not None else "SET_PRIVATE_KEY_PASS"
)


    populated_template = populated_template.replace(
        "SET_PRODUCTION_VALUE",
        "ZATCA-Code-Signing" if props.production else "TSTZATCA-Code-Signing"
    )
    populated_template = populated_template.replace(
    "SET_PRODUCTION_VALUE",
    "ZATCA-Code-Signing" if props.production else "TSTZATCA-Code-Signing"
    )

    populated_template = populated_template.replace(
        "SET_VAT_REGISTRATION_NUMBER",
        props.vat_number
    )
    populated_template = populated_template.replace(
        "SET_BRANCH_LOCATION",
        props.branch_location
    )
    populated_template = populated_template.replace(
        "SET_BRANCH_INDUSTRY",
        props.branch_industry
    )
    populated_template = populated_template.replace(
        "SET_COMMON_NAME",
        props.taxpayer_provided_id
    )
    populated_template = populated_template.replace(
        "SET_BRANCH_NAME",
        props.branch_name
    )
    populated_template = populated_template.replace(
        "SET_TAXPAYER_NAME",
        props.taxpayer_name
    )
    return populated_template




# Function to encrypt a message using the public key
def encrypt_csr(csrConfigFile:str, public_key):
    encrypted_csr = public_key.encrypt(
        csrConfigFile.encode('utf-8'),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return encrypted_csr

def generate_keys(csrConfigFile:str):
    # Generate private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )

    # Generate public key
    public_key = private_key.public_key()

    # Serialize private key
    private_key_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    # Serialize public key
    public_key_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return encrypt_csr(csrConfigFile=csrConfigFile ,public_key=public_key)





# def temprsa(csrConfigFile:str):
#     PublicKey,private_key=rsa.newkeys(2048)
#     PublicKey_pem=PublicKey.save_pkcs1("PEM")
#     private_key_pem=private_key.save_pkcs1("PEM")
#     encrypted_message = rsa.encrypt(csrConfigFile.encode(), PublicKey)
#     print(base64.b64encode(encrypted_message).decode())

    # print(m)
    # with open("public_key.pem", "w") as public_key_file:
    #     public_key_file.write(str(PublicKey_pem))
    # with open("private_key.pem", "w") as public_key_file:
    #     public_key_file.write(str(private_key_pem))


    
    

config_props = CSRConfigProps(
    private_key_pass="password123",
    egs_model="ModelX",
    egs_serial_number="123456",
    solution_name="SolutionA",
    vat_number="123456789012345",
    branch_location="BranchA",
    branch_industry="IndustryA",
    branch_name="BranchName",
    taxpayer_name="TaxpayerName",
    taxpayer_provided_id="TaxpayerID",
    production=True
)
csrConfigFile=populate(config_props)

 
# temprsa(csrConfigFile=csrConfigFile)


from ecdsa import SigningKey, VerifyingKey
from ecdsa.util import randrange_from_seed__trytryagain

def encrypt_with_secp256k1(message: bytes, private_key: VerifyingKey) -> bytes:
    
    public_key = private_key.get_verifying_key()
    print(private_key)
    shared_secret = private_key.privkey.secret_multiplier * public_key.pubkey.point

    # Serialize the shared secret
    shared_secret_bytes = shared_secret.x().to_bytes(32, 'big')

    # Encrypt the message using the shared secret
    encrypted_message = bytes([message_byte ^ shared_secret_byte for message_byte, shared_secret_byte in zip(message, shared_secret_bytes)])

    return encrypted_message

# Generate a key pair
PublicKey,private_key=rsa.newkeys(2048)
PublicKey_pem=PublicKey.save_pkcs1("PEM")
private_key_pem=private_key.save_pkcs1("PEM")

# private_key = SigningKey.generate()
# public_key = private_key.get_verifying_key()



# decrypted_message = decrypt_with_secp256k1(encrypted_message, private_key)
# print(decrypted_message)