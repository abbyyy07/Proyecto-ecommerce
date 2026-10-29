import { apiFetch } from '@/lib/api';
import { TarjetaProducto } from '@/components/TarjetaProducto';

export const metadata = { title: 'Catálogo — TiendaNext' };

export default async function PaginaProductos({ searchParams }) {
  // searchParams viene de la URL, por ejemplo si buscamos algo o filtramos
  const params = await searchParams;
  const query = new URLSearchParams(params).toString();
  
  // Llamamos a nuestra API pasándole los filtros si los hay
  const { datos } = await apiFetch(`/productos?${query}`);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {datos.map(p => <TarjetaProducto key={p.id} producto={p} />)}
      </div>
    </main>
  );
}