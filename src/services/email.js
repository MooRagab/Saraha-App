import nodemailer from 'nodemailer'

export async function sendEmail(dest, subject, message, attachments = []) {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  })

  let info = await transporter.sendMail({
    from: `"RAGAB" <${process.env.NODE_MAILER_EMAIL}>`,
    to: dest,
    subject,
    html: message,
    attachments,
  })
  return info
}
