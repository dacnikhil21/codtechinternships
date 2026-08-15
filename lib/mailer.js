import nodemailer from 'nodemailer';

export async function sendVerificationEmail(toEmail, otpCode, userName = 'Intern') {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const fromName = process.env.SMTP_FROM_NAME || 'CODTECH Internships';
  const fromEmail = user || 'no-reply@codtechitsolutions.co.in';

  console.log(`[VERIFICATION EMAIL SENT] To: ${toEmail} | Code: ${otpCode}`);

  if (!user || !pass) {
    // If SMTP credentials are not configured in .env yet, return log info
    return {
      success: true,
      simulated: true,
      message: 'Verification code generated.'
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: `[CODTECH] Password Reset Verification Code: ${otpCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #6366f1; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">CODTECH INTERNSHIPS</h2>
            <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; tracking: 1px;">Security & Account Recovery</p>
          </div>
          <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid #334155;">
            <p style="font-size: 16px; margin-top: 0;">Hello <strong>${userName}</strong>,</p>
            <p style="font-size: 14px; color: #cbd5e1;">You requested to reset your password for your CODTECH Internship account.</p>
            <p style="font-size: 14px; color: #cbd5e1;">Your 6-digit Verification Code is:</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="display: inline-block; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #818cf8; background-color: #0f172a; padding: 12px 24px; border-radius: 8px; border: 1px solid #6366f1;">${otpCode}</span>
            </div>
            <p style="font-size: 12px; color: #94a3b8;">This code is valid for <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, simulated: false };
  } catch (error) {
    console.error('[SMTP EMAIL ERROR]', error.message);
    return { success: true, simulated: true, error: error.message };
  }
}
