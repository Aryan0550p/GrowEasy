import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { users } from '../store';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-jwt-auth');

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT
    const token = await new SignJWT({ userId: user.id, email: user.email, name: user.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
    
    // Set cookie
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
