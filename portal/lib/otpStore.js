// In-memory OTP store for email verification codes
// Stores { email: { code, expiresAt, verified } }

const globalOtpStore = globalThis._otpStore || new Map();
if (process.env.NODE_ENV !== 'production') {
  globalThis._otpStore = globalOtpStore;
}

export function setOtp(email, code, ttlMinutes = 15) {
  const cleanEmail = String(email).trim().toLowerCase();
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  globalOtpStore.set(cleanEmail, {
    code: String(code).trim(),
    expiresAt,
    verified: false
  });
}

export function verifyOtpCode(email, inputCode) {
  const cleanEmail = String(email).trim().toLowerCase();
  const record = globalOtpStore.get(cleanEmail);

  if (!record) {
    return { valid: false, message: 'No verification code was requested for this email.' };
  }

  if (Date.now() > record.expiresAt) {
    globalOtpStore.delete(cleanEmail);
    return { valid: false, message: 'Verification code has expired. Please request a new code.' };
  }

  if (record.code !== String(inputCode).trim()) {
    return { valid: false, message: 'Invalid verification code. Please check your email and try again.' };
  }

  // Mark as verified
  record.verified = true;
  globalOtpStore.set(cleanEmail, record);
  return { valid: true };
}

export function isOtpVerified(email) {
  const cleanEmail = String(email).trim().toLowerCase();
  const record = globalOtpStore.get(cleanEmail);
  return Boolean(record && record.verified && Date.now() <= record.expiresAt);
}

export function clearOtp(email) {
  const cleanEmail = String(email).trim().toLowerCase();
  globalOtpStore.delete(cleanEmail);
}
