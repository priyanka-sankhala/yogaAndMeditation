import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME || 'Yoga & Meditation'} <${process.env.SMTP_FROM_EMAIL}>`,
      ...options,
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  appUrl: string
): Promise<boolean> {
  const verificationLink = `${appUrl}/verify-email?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to Yoga & Meditation!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationLink}" style="background-color: #7BAE7F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
      <p>Or copy this link: ${verificationLink}</p>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  appUrl: string
): Promise<boolean> {
  const resetLink = `${appUrl}/reset-password?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}" style="background-color: #7BAE7F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}

export async function sendWelcomeEmail(name: string, email: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Welcome to Yoga & Meditation',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining our community.</p>
      <p>Start your journey of mindfulness and wellness today.</p>
    `,
  });
}
