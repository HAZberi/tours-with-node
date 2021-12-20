const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //Activate service: 'GMAIL' in less secure app
  //2) Define the email options

  const mailOptions = {
    from: 'Hassaan Zuberi <mhazuberi@yahoo.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html: html body can be send too
  };

  //3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
