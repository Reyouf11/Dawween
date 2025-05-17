const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendReminderEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("❌ Error sending email:", error);
    } else {
      console.log("✅ Email sent:", info.response);
    }
  });
}

module.exports = sendReminderEmail;
