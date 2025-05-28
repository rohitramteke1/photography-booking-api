const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = async () => {
  // For production, use real SMTP settings
  // For development, use ethereal.email (fake SMTP service)
  let testAccount;
  
  if (process.env.NODE_ENV === 'production') {
    // Production email settings
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Development email testing with Ethereal
    testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
};

// Send admin access confirmation email
const sendAdminAccessEmail = async (email, name, ipAddress, accessTime) => {
  try {
    const transporter = await createTransporter();
    
    // Format the access time
    const formattedTime = new Date(accessTime).toLocaleString();
    
    // Email options
    const mailOptions = {
      from: `"PixelFlair Photography" <${process.env.EMAIL_FROM || 'admin@pixelflair.com'}>`,
      to: email,
      cc: process.env.ADMIN_EMAIL_SECURITY || '',  // Security email for monitoring
      subject: 'Admin Dashboard Access Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333;">Admin Access Confirmation</h2>
          </div>
          
          <p>Hello ${name},</p>
          
          <p>This email confirms that your admin account was accessed on <strong>${formattedTime}</strong>.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #444;">Access Details:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>IP Address:</strong> ${ipAddress}</p>
            <p><strong>Access Time:</strong> ${formattedTime}</p>
          </div>
          
          <p>If this was not you, please contact our security team immediately by replying to this email.</p>
          
          <p>Thank you,<br>PixelFlair Photography Team</p>
        </div>
      `
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    // For development, log the test email URL
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Admin access email sent: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      console.log(`Admin access email sent to ${email}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending admin access email:', error);
    return false;
  }
};

module.exports = {
  sendAdminAccessEmail
}; 