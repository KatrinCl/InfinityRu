import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type EmailOptions = {
  to: string | string[];
  subject: string;
  body: string;
};

const sendEmail = async ({ to, subject, body }: EmailOptions): Promise<nodemailer.SentMessageInfo> => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SENDER_EMAIL) {
    throw new Error('Email configuration is missing. Check SMTP_USER, SMTP_PASS, SENDER_EMAIL in .env');
  }

  try {
    const response = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: body,
    });
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send email');
  }
};

export default sendEmail;