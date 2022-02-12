var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ID, // replace this with real gmail id
    pass: process.env.GMAIL_PASS // replace this with real password
  }
});

const companyEmail = 'no-reply@demo-company.co';
const baseApi = process.env.BASE_API || 'http://localhost:3005';

module.exports.sendVerification = (to, token) => {
  if (!to && !url) {
    return;
  }
  const url = `${baseApi}/verify/${token}`;
  const verifyUrl = `<a target='_blank' href=${url}>${url}</a>`;
  const body = `Thanks for signing up. Here is the link to verify your email ${verifyUrl}. If you do not recognize this registration, please ignore this.`;
  var mailOptions = {
    from: companyEmail,
    to,
    subject: 'Please verify your Email',
    html: body
  };

  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};