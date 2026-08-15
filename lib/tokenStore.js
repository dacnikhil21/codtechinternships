import crypto from 'crypto';

// Shared token store for password reset links
const globalTokenStore = globalThis._resetTokenStore || new Map();
if (process.env.NODE_ENV !== 'production') {
  globalThis._resetTokenStore = globalTokenStore;
}

export function createResetToken(email, ttlMinutes = 30) {
  const cleanEmail = String(email).trim().toLowerCase();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;

  globalTokenStore.set(token, {
    email: cleanEmail,
    token,
    expiresAt,
    used: false
  });

  return token;
}

export function verifyResetToken(token, email) {
  if (!token) return { valid: false, message: 'Reset token is missing.' };

  const record = globalTokenStore.get(String(token).trim());
  if (!record) {
    return { valid: false, message: 'Invalid password reset link.' };
  }

  if (Date.now() > record.expiresAt) {
    globalTokenStore.delete(token);
    return { valid: false, message: 'Password reset link has expired. Please request a new link.' };
  }

  if (email && record.email !== String(email).trim().toLowerCase()) {
    return { valid: false, message: 'Email mismatch for this reset link.' };
  }

  if (record.used) {
    return { valid: false, message: 'This reset link has already been used.' };
  }

  return { valid: true, email: record.email };
}

export function consumeResetToken(token) {
  const record = globalTokenStore.get(String(token).trim());
  if (record) {
    record.used = true;
    globalTokenStore.delete(String(token).trim());
  }
}
