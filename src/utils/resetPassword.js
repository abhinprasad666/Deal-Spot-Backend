import { config } from 'dotenv';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Correct path to ejs template
const templatePath = path.join(__dirname, '../views/emails/resetPassword.ejs');

const mail = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PWD
  }
});

const sendPasswordResetLink = async (email, otp, name) => {
  try {
    const renderedContent = await ejs.renderFile(templatePath, { otp, name });

    const mailOptions = {
      from: `"DealSpot Support" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: 'Reset Your Password - DealSpot',
      html: renderedContent,
    };

    const info = await mail.sendMail(mailOptions);
    return info;

  } catch (error) {
    console.log("Error in resetPassword.js:", error);
    throw error;
  }
};

export default sendPasswordResetLink;