const nodemailer = require('nodemailer');
const crypto = require('crypto');

const sendOTPEmail = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min expiry

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
    <h2 style="color: #2b6cb0;">Your OTP Code</h2>

    <p>Hello,</p>

    <p>You’ve requested a one-time password (OTP) to proceed with your action on our platform. Please use the OTP below to continue:</p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="background-color: #2b6cb0; color: #ffffff; padding: 12px 24px; font-size: 18px; font-weight: bold; border-radius: 5px; display: inline-block;">
        ${otp}
      </span>
    </div>

    <p>This OTP is valid for 10 minutes. If you didn’t request this, please ignore this email or contact our support team.</p>

    <p>We're here to help you succeed in your interview preparation!</p>

    <p>Warm regards,<br/>
    The Interview Prep Team</p>
  </div>
  `;

  await transporter.sendMail({
    from: `"Interview Prep Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code for Interview Prep',
    html: htmlContent,
  });

  return { otp, expiresAt };
};

module.exports = sendOTPEmail;