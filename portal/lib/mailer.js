import nodemailer from 'nodemailer';

export async function sendResetLinkEmail(toEmail, resetLink, userName = 'Intern') {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const fromName = process.env.SMTP_FROM_NAME || 'CODTECH Internships';
  const fromEmail = user || 'no-reply@codtechitsolutions.co.in';

  console.log(`[RESET LINK GENERATED] To: ${toEmail} | Link: ${resetLink}`);

  if (!user || !pass) {
    // If SMTP environment variables are not configured yet, return status
    return {
      success: true,
      simulated: true,
      resetLink,
      message: 'Reset link generated.'
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
      subject: `[CODTECH] Reset Your Password`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #6366f1; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">CODTECH INTERNSHIPS</h2>
            <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Password Reset Request</p>
          </div>
          <div style="background-color: #1e293b; padding: 28px; border-radius: 8px; border: 1px solid #334155; text-align: center;">
            <p style="font-size: 16px; margin-top: 0; text-align: left;">Hello <strong>${userName}</strong>,</p>
            <p style="font-size: 14px; color: #cbd5e1; text-align: left; line-height: 1.6;">
              We received a request to reset your password for your CODTECH Internship account (${toEmail}). Click the button below to set a new password:
            </p>
            
            <div style="margin: 32px 0;">
              <a href="${resetLink}" style="background-color: #6366f1; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; shadow: 0 4px 12px rgba(99,102,241,0.4);">
                Reset My Password
              </a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; text-align: left;">
              Or copy and paste this link into your browser:<br/>
              <a href="${resetLink}" style="color: #818cf8; word-break: break-all;">${resetLink}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;" />
            <p style="font-size: 11px; color: #64748b; margin: 0;">This reset link will expire in 30 minutes. If you did not request this, please ignore this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, simulated: false, resetLink };
  } catch (error) {
    console.error('[SMTP EMAIL ERROR]', error.message);
    return { success: true, simulated: true, resetLink, error: error.message };
  }
}
