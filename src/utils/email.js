/**
 * Email Service using Nodemailer
 * Sends contact form submissions via Gmail SMTP
 */

const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create reusable transporter
const createTransporter = () => {
  // Check if all required environment variables are set
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL) {
    logger.warn('Email service not configured. Set SMTP_* and CONTACT_EMAIL in .env');
    return null;
  }

  return nodemailer.createTransporter({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

/**
 * Send contact form email
 * @param {Object} data - Form data
 * @param {string} data.name - Sender name
 * @param {string} data.email - Sender email
 * @param {string} data.message - Message content
 * @returns {Promise<Object>} - Result of email send
 */
const sendContactEmail = async ({ name, email, message }) => {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error('Email service not configured');
  }

  // Email to you (site owner)
  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER}>`, // Your Gmail as sender
    replyTo: email, // Visitor's email as reply-to
    to: process.env.CONTACT_EMAIL, // Where you want to receive messages
    subject: `Portfolio Contact: Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>

        <div style="margin: 20px 0;">
          <p style="margin: 10px 0;">
            <strong>From:</strong> ${name}
          </p>
          <p style="margin: 10px 0;">
            <strong>Email:</strong>
            <a href="mailto:${email}" style="color: #0066cc;">${email}</a>
          </p>
        </div>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; white-space: pre-wrap; color: #333;">
            ${message}
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>Sent from your portfolio contact form</p>
          <p>Reply directly to this email to respond to ${name}</p>
        </div>
      </div>
    `,
    text: `
New Contact Form Submission

From: ${name}
Email: ${email}

Message:
${message}

---
Sent from your portfolio contact form
Reply to: ${email}
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Contact email sent successfully', {
      messageId: info.messageId,
      from: email,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Failed to send contact email', {
      error: error.message,
      from: email,
    });
    throw error;
  }
};

module.exports = {
  sendContactEmail,
};
