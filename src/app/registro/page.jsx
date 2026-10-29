'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function PaginaRegistro() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [error, setError] = useState('');

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const r = await fetch(`${apiUrl}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password }),
    });

    if (!r.ok) {
      const data = await r.json();
      return setError(data.error ?? 'Error al registrar');
    }

    // Tras el registro exitoso, iniciamos sesión automáticamente
    await signIn('credentials', { email: form.email, password: form.password, callbackUrl: '/' });
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
        <input name="nombre" placeholder="Nombre completo" value={form.nombre}
               onChange={cambiar} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        <input name="email" type="email" placeholder="Email" value={form.email}
               onChange={cambiar} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        <input name="password" type="password" placeholder="Contraseña" value={form.password}
               onChange={cambiar} required minLength={6} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        <input name="confirmar" type="password" placeholder="Confirmar contraseña" value={form.confirmar}
               onChange={cambiar} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        <button type="submit"
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}