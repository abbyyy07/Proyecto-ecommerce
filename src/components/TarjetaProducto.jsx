import Link from 'next/link';
import Image from 'next/image';

export function TarjetaProducto({ producto }) {
  return (
    <Link href={`/productos/${producto.id}`}
          className="group bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <div className="aspect-square relative bg-gray-100">
        <Image src={producto.imagen} alt={producto.nombre}
               fill className="object-cover group-hover:scale-105 transition" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{producto.nombre}</h3>
        <p className="text-lg font-bold text-emerald-600">${producto.precio}</p>
      </div>
    </Link>
  );
}