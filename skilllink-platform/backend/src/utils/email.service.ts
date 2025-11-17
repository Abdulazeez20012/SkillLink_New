import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send({
        to: options.to,
        from: process.env.EMAIL_FROM || 'noreply@skilllink.com',
        subject: options.subject,
        html: options.html,
        text: options.text
      });
    } else {
      // Development: Use nodemailer with local SMTP
      const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        ignoreTLS: true
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@skilllink.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      });
    }
    
    console.log(`✉️  Email sent to ${options.to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};
