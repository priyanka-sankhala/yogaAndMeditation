import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string,
  appUrl: string
): Promise<void> {
  const verificationLink = `${appUrl}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: 'Verify your email',
    html: `
      <h1>Welcome to Yoga & Meditation!</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>Link expires in 24 hours.</p>
    `,
  });
}

export async function sendWelcomeEmail(
  name: string,
  email: string
): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: 'Welcome to Yoga & Meditation',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining our community.</p>
      <p>Start exploring our content and improve your wellness.</p>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  appUrl: string
): Promise<void> {
  const resetLink = `${appUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>Link expires in 1 hour.</p>
    `,
  });
}
