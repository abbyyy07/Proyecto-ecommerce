import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { BotonAgregar } from '@/components/BotonAgregar';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { datos: p } = await apiFetch(`/productos/${id}`);
    return { title: `${p.nombre} — TiendaNext`, description: p.descripcion };
  } catch {
    return { title: 'Producto no encontrado' };
  }
}

export default async function PaginaProducto({ params }) {
  const { id } = await params;
  let producto;
  
  try {
    const res = await apiFetch(`/productos/${id}`);
    producto = res.datos;
  } catch {
    notFound(); 
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden">
          <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>
          <p className="text-2xl font-bold text-emerald-600 mt-2">${producto.precio}</p>
          <p className="mt-4 text-gray-600 leading-relaxed">{producto.descripcion}</p>
          <p className="mt-2 text-sm text-gray-400">Stock: {producto.stock} unidades</p>
          
          <BotonAgregar producto={producto} />
        </div>
      </div>
    </main>
  );
}