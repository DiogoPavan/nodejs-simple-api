const pem = require("pem");
const fs = require("fs");


var appRouter = function (app) {

  app.get("/getCertificateInfo", function (req, res) {
    const pfx = fs.readFileSync('/media/renan/1TB/test.pfx');

    pem.readPkcs12(pfx, { p12Password: 'patrick01'}, (err, cert) => {
      pem.readCertificateInfo(cert.cert, (err, resp) => {
        res.status(200).send(resp);
      }, (err) => {
        res.status(400).send(err);
      });
    });
  });

  
}

module.exports = appRouter;