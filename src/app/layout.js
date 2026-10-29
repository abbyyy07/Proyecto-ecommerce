import './globals.css';
import { Proveedores } from '@/components/Proveedores';
import { Header } from '@/components/Header';

export const metadata = { 
  title: 'TiendaNext', 
  description: 'Ecommerce con Next.js, Tailwind y Stripe' 
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Proveedores>
          <Header />
          {children}
        </Proveedores>
      </body>
    </html>
  );
}