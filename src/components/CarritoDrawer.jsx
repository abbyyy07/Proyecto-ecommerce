'use client';

import { useState, useEffect } from 'react';
import { useCarrito } from '@/contexts/CarritoContext';

export function CarritoDrawer({ abierto, cerrar }) {
  const { items, quitar, actualizarCantidad, total } = useCarrito();
  const [cargando, setCargando] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  async function handlePagar() {
    setCargando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/checkout/crear-sesion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al iniciar el pago');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al conectar con la pasarela de pago');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className={`fixed inset-0 z-50 transition-all ${abierto ? 'visible' : 'invisible pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${abierto ? 'opacity-100' : 'opacity-0'}`}
        onClick={cerrar} 
      />

      <aside className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ${abierto ? 'translate-x-0' : 'translate-x-full'}`}>
        <div>
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold">Tu Carrito</h2>
            <button onClick={cerrar} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
          </div>

          {!montado ? (
            <p className="text-gray-400 text-center py-8">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-400 text-center py-8">El carrito está vacío</p>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-semibold text-sm truncate w-36">{item.nombre}</p>
                    <p className="text-xs text-emerald-600 font-bold">${item.precio} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                            className="w-6 h-6 rounded bg-gray-100 font-bold hover:bg-gray-200 text-sm">−</button>
                    <span className="text-sm font-semibold">{item.cantidad}</span>
                    <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                            className="w-6 h-6 rounded bg-gray-100 font-bold hover:bg-gray-200 text-sm">+</button>
                    <button onClick={() => quitar(item.id)}
                            className="text-red-400 hover:text-red-600 text-xs ml-1">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {montado && items.length > 0 && (
          <div className="border-t pt-4 mt-auto">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total:</span>
              <span className="text-emerald-600">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handlePagar}
              disabled={cargando}
              className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {cargando ? 'Procesando...' : 'Pagar con Stripe'}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}