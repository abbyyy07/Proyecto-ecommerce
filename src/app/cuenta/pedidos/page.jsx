'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function PaginaMisPedidos() {
  const { data: session } = useSession();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarPedidos() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/pedidos`, {
          headers: {
            'x-user-email': session?.user?.email || '',
          },
        });
        const data = await res.json();
        setPedidos(data.datos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }

    if (session?.user?.email) {
      cargarPedidos();
    }
  }, [session]);

  if (cargando) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Cargando tus pedidos...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
          <p className="mb-4">Aún no has realizado ninguna compra.</p>
          <a href="/productos" className="inline-block px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">
            Ir a la tienda
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="bg-white rounded-xl shadow border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Pedido #{pedido.id}</p>
                <p className="text-lg font-bold text-emerald-600 mt-1">${pedido.total}</p>
                <p className="text-xs text-gray-500 mt-1">Fecha: {new Date(pedido.fecha).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase">
                  {pedido.estado || 'Completado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}