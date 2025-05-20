const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, verificationLink, fullName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
    <h2 style="color: #2b6cb0;">Welcome aboard, ${fullName}!</h2>

    <p>We’re thrilled to have you on your journey toward mastering interviews. You're just one step away from joining our platform.</p>

    <p>Please verify your email to activate your account and access top-notch interview preparation materials, guidance, and resources that will help you succeed in your career goals.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}" style="background-color: #2b6cb0; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
        Verify Your Email
      </a>
    </div>

    <p>If the button above doesn't work, you can also click the link below or paste it into your browser:</p>
    <p style="word-break: break-word;"><a href="${verificationLink}">${verificationLink}</a></p>

    <p>We're here to support you every step of the way. Wishing you all the best with your interview preparation!</p>

    <p>Warm regards,<br/>
    The Interview Prep Team</p>
  </div>
  `;

  await transporter.sendMail({
    from: `"Interview Prep Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email to complete your signup',
    html: htmlContent,
  });
};

module.exports = sendVerificationEmail;
