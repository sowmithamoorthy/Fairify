import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASS
  }
});

export const sendVerificationEmail = async (name, email) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL, // Goes to admin for approval
    subject: 'New Seller Verification Request',
    html: `
      <h2>New Seller Signup</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p>Please review this seller in the admin dashboard.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};