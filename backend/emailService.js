const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org', 
    port: 2525, // Changed to 2525 
    secure: false, // Use STARTTLS
    auth: {
        user: process.env.MAILGUN_SMTP_LOGIN, 
        pass: process.env.MAILGUN_SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
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
        from: `"AuraCare Support Alert" <${process.env.MAILGUN_SENDER_EMAIL}>`,
        to: recipientEmail,
        replyTo: process.env.MAILGUN_SENDER_EMAIL, // Set reply-to address
        subject: `URGENT: ${userName} Needs Your Support - AuraCare Alert`,
        
        // Plain text version for better deliverability
        text: `
Dear ${recipientName},

This is an urgent notification from the AuraCare mental health support application.

${userName} has just activated their "I Need Support Now" signal and is reaching out to their trusted support circle.

They are going through a difficult time and need your immediate support.

Please reach out to them as soon as possible through:
- Phone call
- Text message
- Video call
- Or any other preferred method of communication

Your support is important to them right now.

Thank you for being a part of their support circle.

---
This is an automated message from AuraCare. Please do not reply to this email.
If you believe you received this message in error, please contact support@auracare.com
        `,
        
        // HTML version with improved formatting and deliverability
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuraCare Support Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #8B5FBF; border-radius: 8px 8px 0 0; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                                🚨 Immediate Support Needed
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                Dear <strong>${recipientName}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                This is an automated and urgent notification from the <strong>AuraCare</strong> mental health support application.
                            </p>
                            
                            <div style="background-color: #FFF3CD; border-left: 4px solid #FFC107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #856404;">
                                    Your friend, <span style="color: #D9534F;">${userName}</span>, has just activated their "I Need Support Now" signal.
                                </p>
                            </div>
                            
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                They are reaching out to their trusted support circle because they are going through a difficult time.
                            </p>
                            
                            <div style="background-color: #E8F5E9; padding: 20px; margin: 20px 0; border-radius: 8px; border: 2px solid #4CAF50;">
                                <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #2E7D32;">
                                    Please reach out to them immediately through:
                                </p>
                                <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                                    <li>Phone call</li>
                                    <li>Text message</li>
                                    <li>Video call</li>
                                    <li>Or any other preferred method of communication</li>
                                </ul>
                            </div>
                            
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                Your support is important to them right now.
                            </p>
                            
                            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                Thank you for being a part of their support circle.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #777777; text-align: center;">
                                This is an automated message from AuraCare. Please do not reply to this email.<br>
                                If you believe you received this message in error, please contact <a href="mailto:support@auracare.com" style="color: #8B5FBF; text-decoration: none;">support@auracare.com</a>
                            </p>
                            <p style="margin: 15px 0 0 0; font-size: 11px; color: #999999; text-align: center;">
                                AuraCare - Mental Health Support Platform<br>
                                Helping people stay connected and supported
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
        
        // Additional headers to improve deliverability
        headers: {
            'X-Priority': '1', // High priority
            'X-MSMail-Priority': 'High',
            'Importance': 'high',
            'X-Mailer': 'AuraCare Support System',
            'List-Unsubscribe': `<mailto:unsubscribe@auracare.com?subject=Unsubscribe>`, // Allow unsubscribe
        }
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✓ Email sent successfully to ${recipientName} (${recipientEmail}): ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`✗ Error sending email to ${recipientName} (${recipientEmail}):`, error.message);
        return false;
    }
};

// Verify transporter configuration on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('Email transporter configuration error:', error);
    } else {
        console.log('✓ Email server is ready to send messages');
    }
});

module.exports = { sendSupportEmail };
