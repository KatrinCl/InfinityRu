import nodemailer from 'nodemailer'

const brevoSmtpHost = 'smtp-relay.brevo.com'
const brevoSmtpPort = 587
const brevoApiKey = process.env.BREVO_API_KEY

export const transporter = brevoApiKey
  ? nodemailer.createTransport({
      host: brevoSmtpHost,
      port: brevoSmtpPort,
      auth: {
        user: 'api',
        pass: brevoApiKey,
      },
    })
  : null

export const isBrevoConfigured = transporter !== null

if (!isBrevoConfigured && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  Brevo is not configured. Set BREVO_API_KEY in .env')
}

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}) => {
  if (!transporter) {
    console.log('📧 Email would be sent:', { to, subject })
    return { success: false, message: 'Email service not configured' }
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to,
      subject,
      html,
      text,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email send error'
    return { success: false, message }
  }
}
