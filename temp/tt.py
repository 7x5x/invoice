from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization

def create_csr():
    key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )

    country =  'sa'
    state = 'state'
    locality = 'locality'
    organization =  'organization'
    common_name ='common_name'
    dns_name1 = common_name
    dns_name2 = f'www.{common_name}'

    csr = x509.CertificateSigningRequestBuilder().subject_name(x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, country),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, state),
        x509.NameAttribute(NameOID.LOCALITY_NAME, locality),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, organization),
        x509.NameAttribute(NameOID.COMMON_NAME, common_name)
    ])).add_extension(
        x509.SubjectAlternativeName([
            x509.DNSName(dns_name1),
            x509.DNSName(dns_name2)
        ]),
        critical=False,
    ).sign(key, hashes.SHA256())
    print(csr)
    return {'key': key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption()).decode('utf-8'), 'csr': csr.public_bytes(
            encoding=serialization.Encoding.PEM).decode('utf-8')}
    
    
print(create_csr())