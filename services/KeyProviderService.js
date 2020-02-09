class KeyProviderService {
  constructor(cert) {
    this.cert = cert;
  }

  getX509Cert() {
    return this.cert
      .replace('-----BEGIN CERTIFICATE-----', '')
      .replace('-----END CERTIFICATE-----', '')
      .replace(/\s/g, '')
      .replace(/(\r\n\t|\n|\r\t)/gm, '');
  }

  getKeyInfo() {
    return `<X509Data><X509Certificate>${this.getX509Cert()}</X509Certificate></X509Data>`;
  }
}

module.exports = KeyProviderService;
