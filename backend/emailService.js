const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'harshitrishav2003@gmail.com', 
      pass: '', 
    },
  });

  const mailOptions = {
    from: 'harshitrishav987@gmail.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = sendEmail;
