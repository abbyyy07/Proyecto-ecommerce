'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function PaginaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await signIn('credentials', {
      email, password, redirect: false,
    });
    if (res?.error) setError('Email o contraseña incorrectos');
    else window.location.href = '/';
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

      <button onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 mb-6 font-medium transition flex items-center justify-center gap-2">
        Continuar con Google
      </button>

      <div className="text-center text-gray-400 mb-6 text-sm">— o con tu email —</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
        <input type="email" placeholder="Email" value={email}
               onChange={e => setEmail(e.target.value)} required
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        <input type="password" placeholder="Contraseña" value={password}
               onChange={e => setPassword(e.target.value)} required
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        <button type="submit"
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">
          Entrar
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="text-emerald-600 font-semibold hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </main>
  );
}