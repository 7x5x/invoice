#Saudi Arabian electronic invoice onboarding script
#Version 1.1
param($action, $endpoint, $otp, $csrconfig, $password)
$env:path = $env:path + ";C:\Program Files\Git\usr\bin"

$simulationEndpoint = 'https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation'
$prodEndpoint = 'https://gw-fatoora.zatca.gov.sa/e-invoicing/core'

if ($endpoint -eq "simulation") {
    $serviceEndpoint = $simulationEndpoint
}
elseif ($endpoint -eq "prod") {
    $serviceEndpoint = $prodEndpoint
}
else {
    Write-Host "`nMissing parameter (with values simulation/prod): endpoint"
    Break
}

if ($action -eq "getComplianceCSID") {
    if (-not (Test-Path -Path $csrconfig)) {
        throw "CSR configuration file does not exist, please make sure to provide a valid file path for the '-csrconfig' parameter."
    }

    if ($otp -eq $null) {
        throw "OTP code is not provided, please carry correct parameters."
    }

    #Generate private key
    openssl ecparam -name secp256k1 -genkey -noout -out privatekey.pem
    Write-Host "Private key generated."

    #Generate public key
    openssl ec -in privatekey.pem -pubout -conv_form compressed -out publickey.pem
    Write-Host "Public key generated."

    #Generate CSR(Certificate signing request)
    openssl base64 -d -in publickey.pem -out publickey.bin
    openssl req -new -sha256 -key privatekey.pem -extensions v3_req -config $csrconfig -out .\taxpayer.csr 
    openssl base64 -in taxpayer.csr -out taxpayerCSRbase64Encoded.txt
    $CSRbase64Encoded = Get-Content -path taxpayerCSRbase64Encoded.txt -Raw
    $CSRbase64Encoded = $CSRbase64Encoded -replace "`n", ""
    $CSRbase64Encoded = $CSRbase64Encoded -replace "`r", ""

    #Init request for CCSID
    $postParams = @{"csr" = $CSRbase64Encoded } | ConvertTo-Json
    $postHeader = @{
        "Accept"         = "application/json"
        "OTP"            = $otp
        "Content-Type"   = "application/json"
        "Accept-Version" = "V2"
    }
    echo $CSRbase64Encoded
    try {
        $response = Invoke-WebRequest -Uri $serviceEndpoint'/compliance' -Method POST -Body $postParams -Headers $postHeader 
    }
    catch {
        $respStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($respStream)
        $respBody = $reader.ReadToEnd()
        $reader.Close()

        Write-Host "`nZatca service communication error:"
        Write-Host $_.Exception.Message
        Write-Host "Detailed error message: " $respBody
        Write-Host "The process of obtaining a Compliance CSID (CCSID) is interrupted."
    }

    if ($response -ne $null) {
        $response = $response | ConvertFrom-Json
        $requestId = $response.requestID
        Write-Host "Request ID:"
        Write-Host $requestId
        $requestId | Out-File -FilePath .\requestId.txt -Encoding utf8 -NoNewline

        $CCSIDbase64 = $response.binarySecurityToken
        Write-Host "`nCompliance CSID received from Zatca:"
        Write-Host $CCSIDbase64
        $CCSID = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($CCSIDbase64))
        $CCSIDCertString = "-----BEGIN CERTIFICATE-----`n" + $CCSID + "`n" + "-----END CERTIFICATE-----"

        $CCSIDSecret = $response.secret
        Write-Host "`nCompliance CSID secret received from Zatca:"
        Write-Host $CCSIDSecret

        $CCSIDStringFileName = "CCSIDString.txt"
        $CCSIDSecretFileName = "CCSIDSecret.txt"
        $CCSIDCertFileName = "CCSID.pem"
        $CCSIDFolderPath = Get-Location
        $CCSIDCertFilePath = Join-Path $CCSIDFolderPath $CCSIDCertFileName
        $CCSIDStringFilePath = Join-Path $CCSIDFolderPath $CCSIDStringFileName
        $CCSIDSecretFilePath = Join-Path $CCSIDFolderPath $CCSIDSecretFileName

        $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
        [System.IO.File]::WriteAllLines($CCSIDCertFilePath, $CCSIDCertString, $Utf8NoBomEncoding)
        [System.IO.File]::WriteAllLines($CCSIDStringFilePath, $CCSIDbase64, $Utf8NoBomEncoding)
        [System.IO.File]::WriteAllLines($CCSIDSecretFilePath, $CCSIDSecret, $Utf8NoBomEncoding)

        openssl pkcs12 -inkey privatekey.pem -in CCSID.pem -export -passout pass:$password -out CCSID.pfx
        Write-Host "`nCertificate is saved to CCSID.pfx file and secret is saved to CCSIDSecret.txt file."
        Write-Host "The process of obtaining a Compliance CSID (CCSID) is complete, please process the compliance check and do not delete or move any created files before getting PCSID."
    }

}


if ($action -eq "getProductionCSID") {
    if (-not (Test-Path -Path requestId.txt)) {
        throw "'requestId.txt' file is missing, please make sure you're running the script in the same location where the results of getting the CCSID are stored."
    }
    if (-not (Test-Path -Path CCSIDString.txt)) {
        throw "'CCSIDString.txt' file is missing, please make sure you're running the script in the same location where the results of getting the CCSID are stored."
    }
    if (-not (Test-Path -Path CCSIDSecret.txt)) {
        throw "'CCSIDSecret.txt' file is missing, please make sure you're running the script in the same location where the results of getting the CCSID are stored."
    }

    $requestId = Get-Content -path requestId.txt -Raw
    $requestId = $requestId -replace "`n", ""
    $requestId = $requestId -replace "`r", ""
    Write-Host "Request ID is:" $requestId
    $CCSID = Get-Content -path CCSIDString.txt -Raw
    $CCSID = $CCSID -replace "`n", ""
    $CCSID = $CCSID -replace "`r", ""
    Write-Host "`nCompliance CSID read locally:"
    Write-Host $CCSID
    $CCSIDSecretString = Get-Content -path CCSIDSecret.txt -Raw
    $CCSIDSecretString = $CCSIDSecretString -replace "`n", ""
    $CCSIDSecretString = $CCSIDSecretString -replace "`r", ""
    Write-Host "`nCompliance CSID secret read locally:"
    Write-Host $CCSIDSecretString
    $AuthTokenString = $CCSID + ":" + $CCSIDSecretString
    $BasicAuthToken = "Basic " + [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($AuthTokenString))

    #Init request for Production CSID (PCSID)
    $postParams = @{"compliance_request_id" = $requestId } | ConvertTo-Json
    $postHeader = @{
        "Accept"         = "application/json"
        "Authorization"  = $BasicAuthToken
        "Content-Type"   = "application/json"
        "Accept-Version" = "V2"
    }

    try {
        $response = Invoke-WebRequest -Uri $serviceEndpoint'/production/csids' -Method POST -Body $postParams -Headers $postHeader
    }
    catch {
        $respStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($respStream)
        $respBody = $reader.ReadToEnd()
        $reader.Close() 

        Write-Host "`nZatca service communication error:"
        Write-Host $_.Exception.Message
        Write-Host "Detailed error message: " $respBody 
        Write-Host "Please make sure the compliance check process has been done before obtaining a Production CSID (PCSID)."
        Write-Host "The process of obtaining a Production CSID (PCSID) is interrupted."
    }

    if ($response -ne $null) {
        $response = $response | ConvertFrom-Json
        $PCSIDbase64 = $response.binarySecurityToken
        Write-Host "`nProduction CSID received from Zatca:"
        Write-Host $PCSIDbase64

        $PCSID = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($PCSIDbase64))
        $PCSIDCertString = "-----BEGIN CERTIFICATE-----`n" + $PCSID + "`n" + "-----END CERTIFICATE-----"

        $PCSIDSecret = $response.secret
        Write-Host "`nProduction CSID secret received from Zatca:"
        Write-Host $PCSIDSecret

        $PCSIDCertFileName = "PCSID.pem"
        $PCSIDSecretFileName = "PCSIDSecret.txt"
        $PCSIDFolderPath = Get-Location
        $PCSIDCertFilePath = Join-Path $PCSIDFolderPath $PCSIDCertFileName
        $PCSIDSecretFilePath = Join-Path $PCSIDFolderPath $PCSIDSecretFileName

        $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
        [System.IO.File]::WriteAllLines($PCSIDCertFilePath, $PCSIDCertString, $Utf8NoBomEncoding)
        [System.IO.File]::WriteAllLines($PCSIDSecretFilePath, $PCSIDSecret, $Utf8NoBomEncoding)

        # Sandbox API will get error: openssl : No certificate matches private key
        openssl pkcs12 -inkey privatekey.pem -in PCSID.pem -export -passout pass:$password -out PCSID.pfx

        if (Test-Path -Path PCSID.pfx) {
            Write-Host "`nCertificate is saved to PCSID.pfx file and secret is saved to PCSIDSecret.txt file."
            Write-Host "The process of obtaining a Production CSID (PCSID) is complete."
        }
        else {
            Write-Host "`nThe process of obtaining a Production CSID (PCSID) is interrupted."
        }
    }
}