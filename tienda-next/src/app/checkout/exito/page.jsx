'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCarrito } from '@/contexts/CarritoContext';

export default function PaginaExito() {
  const { setItems } = useCarrito();

  useEffect(() => {
    setItems([]);
  }, [setItems]);

  return (
    <main className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
        ✓
      </div>
      <h1 className="text-3xl font-bold mb-2">¡Pago completado!</h1>
      <p className="text-gray-600 mb-8">Gracias por tu compra. Hemos recibido tu pedido correctamente.</p>
      <Link 
        href="/productos" 
        className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
      >
        Volver a la tienda
      </Link>
    </main>
  );
}