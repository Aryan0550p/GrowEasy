import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { users } from '../store';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-jwt-auth');

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (users.find(u => u.email === email)) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // In a real app, hash the password using bcrypt
    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);

    // Create JWT
    const token = await new SignJWT({ userId: newUser.id, email: newUser.email, name: newUser.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, user: { name: newUser.name, email: newUser.email } });
    
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
