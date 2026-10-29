'use client';

import { SessionProvider } from 'next-auth/react';
import { CarritoProvider } from '@/contexts/CarritoContext';

export function Proveedores({ children }) {
  return (
    <SessionProvider>
      <CarritoProvider>
        {children}
      </CarritoProvider>
    </SessionProvider>
  );
}