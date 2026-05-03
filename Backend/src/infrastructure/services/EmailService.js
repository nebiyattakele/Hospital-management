class EmailService {
  async sendEmail(to, subject, text) {
    // This is a placeholder for actual email sending logic (e.g., using Nodemailer or SendGrid)
    console.log(`Sending email to ${to}...`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${text}`);
    return true;
  }

  async sendPasswordResetEmail(to, resetToken) {
    const subject = 'Password Reset Request';
    const text = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://localhost:3000/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`;
    
    return await this.sendEmail(to, subject, text);
  }
}

module.exports = new EmailService();
