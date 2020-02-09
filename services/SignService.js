const pem = require('pem');
const fs = require('fs');
const path = require('path');
const { SignedXml } = require('xml-crypto');

const KeyProviderService = require('./KeyProviderService');

class SignService {
  signXml(req, res) {
    const pfxPath = path.resolve(__dirname, '..', 'tmp', 'pfx');
    const pfx = fs.readFileSync(pfxPath + '/test.pfx');
    const { buffer, originalname } = req.file;
    const nameXml = originalname.replace('.xml', '');
    const xml = buffer.toString();

    pem.readPkcs12(pfx, { p12Password: 'patrick01' }, (err, cert) => {
      if (err) {
        return res.status(400).send(err);
      }

      const signed = new SignedXml();
      const xmlPath = path.resolve(__dirname, '..', 'tmp', 'xml');
      const transforms = [
        'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
        'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
      ];

      signed.addReference("//*[local-name(.)='InfNfse']", transforms);
      signed.canonicalizationAlgorithm =
        'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
      signed.signingKey = cert.key;
      signed.keyInfoProvider = new KeyProviderService(cert.cert);
      signed.computeSignature(xml);

      fs.writeFileSync(
        `${xmlPath}/${nameXml}signed.xml`,
        signed.getSignedXml()
      );

      return res.status(200).send('signed');
    });
  }
}

module.exports = new SignService();
