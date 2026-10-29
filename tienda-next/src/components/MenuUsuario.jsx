'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function MenuUsuario() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Link href="/login" className="text-sm font-semibold hover:text-emerald-600 transition">
        Iniciar sesión
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">{session.user.name}</span>
      {session.user.rol === 'admin' && (
        <Link href="/admin/productos" className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold hover:bg-emerald-200">
          Admin
        </Link>
      )}
      <button onClick={() => signOut()} className="text-xs text-gray-400 hover:text-red-500 transition">
        Salir
      </button>
    </div>
  );
}