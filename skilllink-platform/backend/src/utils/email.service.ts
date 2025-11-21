import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    // Check if Gmail SMTP is configured
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: `"SkillLink" <${process.env.GMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      });

      console.log(`✉️  Email sent to ${options.to} via Gmail`);
    } else {
      // Development mode: Log email instead of sending
      console.log(`📧 [DEV MODE] Email would be sent to: ${options.to}`);
      console.log(`   Subject: ${options.subject}`);
      console.log(`   Content: ${options.text || options.html.substring(0, 100)}...`);
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    // Don't throw error in development - just log it
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};
