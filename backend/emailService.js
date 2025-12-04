const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org', 
    port: 587, 
    secure: false, 
    auth: {
        user: process.env.MAILGUN_SMTP_LOGIN, 
        pass: process.env.MAILGUN_SMTP_PASSWORD
    }
});

/**
 * Sends an email notification to a support contact.
 * @param {string} recipientEmail - The email address of the support contact.
 * @param {string} recipientName - The name of the support contact.
 * @param {string} userName - The name of the user who needs support.
 */
const sendSupportEmail = async (recipientEmail, recipientName, userName) => {
    const mailOptions = {
        from: process.env.MAILGUN_SENDER_EMAIL, // Use a dedicated sender email for Mailgun
        to: recipientEmail,
        subject: `URGENT: ${userName} Needs Your Support Now - AuraCare Notification`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #8B5FBF;">Immediate Support Needed</h2>
                <p>Dear ${recipientName},</p>
                <p>This is an automated and urgent notification from the AuraCare application.</p>
                <p style="font-size: 18px; font-weight: bold; color: #D9534F;">
                    Your friend, ${userName}, has just activated their "I Need Support Now" signal.
                </p>
                <p>They are reaching out to their trusted support circle because they are going through a difficult time.</p>
                <p><strong>Please reach out to them immediately</strong> through a phone call, text message, or any other preferred method of communication.</p>
                <p>Your support is important to them right now.</p>
                <p>Thank you for being a part of their support circle.</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #777;">
                    This is an unmonitored email address. Please do not reply to this message.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipientName} (${recipientEmail}): ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`Error sending email to ${recipientName} (${recipientEmail}):`, error);
        return false;
    }
};

module.exports = { sendSupportEmail };
