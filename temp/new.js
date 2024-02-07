// const TLV = (tagName, tagValue) => {
//     var tagBuf = Buffer.from(tagName, 'utf8');
//     var tagValueLenBuf = Buffer.from([tagValue.length], 'utf8');
//     var tagValueBuf = Buffer.from(tagValue, 'utf8');

//     var bufArray = [tagBuf, tagValueLenBuf, tagValueBuf];

//     return Buffer.concat(bufArray);
// }

// var SellerName = TLV("1", "Nassaco");
// console.log('SellerName');
// console.log(SellerName);
// var VATnummber = TLV("2", "100025906700003");
// var TimeStamp = TLV("3", "2024-1-24T15:30:00z");
// var InvoiceAmount = TLV("4", "2100100.99");
// var VATAmount = TLV("5", "315015.15");

// var tagsBuArray = [SellerName, VATnummber, TimeStamp, InvoiceAmount, VATAmount];
// var qr = Buffer.concat(tagsBuArray);
// console.log('tagsBuArray')
// console.log(qr)
// var qrbase64 = qr.toString('base64');

// console.log('qrbase64')
// console.log(qrbase64)


// var decodedBuffer = Buffer.from(qrbase64, 'base64');
// var decodedString = decodedBuffer.toString('utf8');

// console.log("decodedString");
// console.log(decodedString);
///////////////////////////////////


// const QRCode = require('qrcode');
// const fs = require('fs');

// function generatePayload() {
//   const fields = [
//     { tag: 1, value: '2024-01-31' },
//     { tag: 2, value: "Seller's name" },
//     { tag: 3, value: '1234567890' },
//     { tag: 4, value: '2024-01-31T06:57:47Z' },
//     { tag: 5, value: '100.00' },
//     { tag: 6, value: '15.00' },
//     { tag: 7, value: 'hash of XML invoice' },
//     { tag: 8, value: 'ECDSA signature' },
//     { tag: 9, value: 'ECDSA public key' },
//     { tag: 10, value: 'ECDSA signature of the cryptographic stamp’s public key by ZATCA’s technical CA' }
//   ];

//   return fields.map(field => encodeField(field.tag, field.value)).join('');
// }

// function encodeField(tag, value) {
//   const valueBytes = Buffer.from(value, 'utf8');
//   const length = valueBytes.length;

//   const fieldBytes = Buffer.alloc(2 + length);
//   fieldBytes[0] = tag;
//   fieldBytes[1] = length;
//   valueBytes.copy(fieldBytes, 2);

//   return fieldBytes.toString('base64');
// }

// async function generateQRCode() {
//   const payload = generatePayload();

//   try {
//     await QRCode.toFile('FatoraKSA_QRCode.png', payload, {
//       width: 200,
//       errorCorrectionLevel: 'H'
//     });

//     console.log('QR code generated successfully.');
//   } catch (error) {
//     console.error('Error generating QR code:', error);
//   }
// }

// generateQRCode().catch(console.error);