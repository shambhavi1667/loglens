const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.SERVER_URL}/auth/verify-email/${token}`

  await transporter.sendMail({
    from: `"LogLens" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your LogLens account',
    html: `
      <h2>Welcome to LogLens!</h2>
      <p>Click the button below to verify your email address:</p>
      <a href="${verificationUrl}" style="
        background: #6366f1;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        text-decoration: none;
        display: inline-block;
        margin: 16px 0;
      ">Verify Email</a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link expires in 24 hours.</p>
    `
  })
}

module.exports = { sendVerificationEmail }