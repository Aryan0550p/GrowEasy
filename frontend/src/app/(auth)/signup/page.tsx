'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Create an account</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Start managing your leads in seconds.</p>

      {error && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '24px', fontSize: '0.875rem', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jane Doe"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Email address</label>
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Create a password"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Already have an account? <Link href="/login" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
      </div>
    </div>
  );
}
