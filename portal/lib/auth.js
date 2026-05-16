import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'codtechintern-secret-key-2024';
const key = new TextEncoder().encode(JWT_SECRET);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (err) {
    console.error('[AUTH] Decrypt failed:', err.message);
    return null;
  }
}

export async function login(user) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ 
    id: user.id,
    email: user.email, 
    role: user.role,
    course: user.course,
    name: user.name,
    expires 
  });

  const cookieStore = cookies();
  cookieStore.set('session', session, { 
    expires, 
    httpOnly: true, 
    secure: true, 
    sameSite: 'lax',
    path: '/'
  });

  return session; // Return for explicit setting if needed
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) {
    console.log('[AUTH] No session cookie found in request');
    return null;
  }
  return await decrypt(session);
}
