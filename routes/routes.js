const pem = require('pem');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const multerConfigPfx = require('../config/multerPfx');
const multerConfigXml = require('../config/multerXml');
const SignService = require('../services/SignService');

const appRouter = function(app) {
  app.get('/getCertificateInfo', function(req, res) {
    const pfxPath = path.resolve(__dirname, '..', 'tmp', 'pfx');
    const pfx = fs.readFileSync(pfxPath + '/test.pfx');

    pem.readPkcs12(pfx, { p12Password: 'patrick01' }, (err, cert) => {
      pem.readCertificateInfo(
        cert.cert,
        (err, resp) => {
          res.status(200).send(resp);
        },
        err => {
          res.status(400).send(err);
        }
      );
    });
  });

  app.post(
    '/savecertificate',
    multer(multerConfigPfx).single('certificate'),
    function(req, res) {
      const { originalname } = req.file;

      return res.status(200).send(`${originalname} saved`);
    }
  );

  app.post(
    '/signxml',
    multer(multerConfigXml).single('xml'),
    SignService.signXml
  );
};

module.exports = appRouter;
