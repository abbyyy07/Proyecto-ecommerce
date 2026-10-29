'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Ctx = createContext();

export const useCarrito = () => useContext(Ctx);

export function CarritoProvider({ children }) {
  const { data: session } = useSession();

  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const guardado = localStorage.getItem('carrito');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('carrito', JSON.stringify(items));
    } catch {}
  }, [items]);

  function agregar(producto) {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) return prev.map(i =>
        i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
      );
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }

  function quitar(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function actualizarCantidad(id, cantidad) {
    if (cantidad < 1) return quitar(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i));
  }

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);

  return (
    <Ctx.Provider value={{ items, agregar, quitar, actualizarCantidad, total, totalItems, setItems }}>
      {children}
    </Ctx.Provider>
  );
}