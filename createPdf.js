const pdf = require('html-pdf');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
// const mime = require('mime');
const path = require('path');
const URL = "http://localhost:3300";


module.exports = function CreatePdf(server) {
  const env = (() => dotenv.config().parsed)();

  const { NODEMAILER_USER } = env;
  const { NODEMAILER_PASSWORD } = env;


  server.post('/api/makeInvoice', (req, res) => {
    pdf.create(req.body.html, {}).toFile(`./pdfs/Invoice${req.body.invoiceId}.pdf`, err => {
      if (err) {
        res.send(Promise.reject());
      }
      const mailOptions = {
        from: NODEMAILER_USER,
        to: req.body.email,
        subject: 'CHECK',
        // text: req.body.text
        html: req.body.html,
        attachments: [
          {
            filename: `Invoice${req.body.invoiceId}.pdf`,
            path: `./pdfs/Invoice${req.body.invoiceId}.pdf`,
          },
        ],
      };

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: NODEMAILER_USER, //* ToDo: Create Exchange user
          pass: NODEMAILER_PASSWORD,
        },
      });
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send({ message: "Email didn't sent :(", url: `${ URL }/api/download/invoice/${req.body.invoiceId}` });
        } else {
          console.log(info);
          res.status(200).send({ message: 'Email Sent! :)', url: `${ URL }/api/download/invoice/${req.body.invoiceId}` });
        }
      });
      // res.send(Promise.resolve());
    });
  });

  server.get('/api/download/invoice/:id', function(req, res){
    res.sendFile(path.join(__dirname + `/pdfs/Invoice${req.params.id}.pdf`));
  });
}
