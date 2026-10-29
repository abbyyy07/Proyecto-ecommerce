'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCarrito } from '@/contexts/CarritoContext';
import { MenuUsuario } from './MenuUsuario';
import { CarritoDrawer } from './CarritoDrawer';

export function Header() {
  const { totalItems } = useCarrito();
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-black text-emerald-600 tracking-tight">
          TiendaNext
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/productos" className="text-sm font-medium hover:text-emerald-600 transition">
            Catálogo
          </Link>
          
          <MenuUsuario />

          <button 
            onClick={() => setCarritoAbierto(true)}
            className="relative p-2 bg-emerald-50 rounded-full text-emerald-700 hover:bg-emerald-100 transition"
            aria-label="Ver carrito"
          >
            🛒
            {montado && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </nav>
      </div>

      <CarritoDrawer abierto={carritoAbierto} cerrar={() => setCarritoAbierto(false)} />
    </header>
  );
}