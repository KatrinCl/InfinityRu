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
  console.log('=== EMAIL SEND ATTEMPT ===');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'NOT SET');
  console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SENDER_EMAIL) {
    console.error('Email configuration is missing!');
    throw new Error('Email configuration is missing. Check SMTP_USER, SMTP_PASS, SENDER_EMAIL in .env');
  }

  try {
    const response = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: body,
    });
    console.log('Email sent successfully:', response.messageId);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send email');
  }
};

export default sendEmail;