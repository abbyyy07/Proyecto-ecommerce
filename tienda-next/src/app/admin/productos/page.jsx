'use client';

import { useState, useEffect } from 'react';

export default function PaginaAdminProductos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: '',
    categoria_id: '1'
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Cargar productos al montar la página
  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/productos`);
      const data = await res.json();
      setProductos(data.datos || []);
    } catch (err) {
      console.error(err);
    }
  }

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setExito('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al crear el producto');

      setExito('¡Producto creado con éxito!');
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '', categoria_id: '1' });
      cargarProductos(); // Recargar la lista
    } catch (err) {
      setError(err.message);
    }
  }

  async function eliminar(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/productos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) cargarProductos();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración - Productos</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulario para crear producto */}
        <div className="bg-white p-6 rounded-xl shadow border md:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-4">Añadir Nuevo Producto</h2>
          
          {error && <p className="bg-red-50 text-red-600 p-2 text-sm rounded mb-4">{error}</p>}
          {exito && <p className="bg-emerald-50 text-emerald-600 p-2 text-sm rounded mb-4">{exito}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Nombre</label>
              <input name="nombre" value={form.nombre} onChange={cambiar} required
                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={cambiar} required rows="2"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Precio ($)</label>
                <input name="precio" type="number" step="0.01" value={form.precio} onChange={cambiar} required
                       className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Stock</label>
                <input name="stock" type="number" value={form.stock} onChange={cambiar} required
                       className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Ruta Imagen (ej: /img/teclado.jpg)</label>
              <input name="imagen" value={form.imagen} onChange={cambiar} required
                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Categoría ID</label>
              <input name="categoria_id" type="number" value={form.categoria_id} onChange={cambiar} required
                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
            </div>

            <button type="submit"
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition">
              Guardar Producto
            </button>
          </form>
        </div>

        {/* Tabla de productos existentes */}
        <div className="bg-white p-6 rounded-xl shadow border md:col-span-2 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Inventario Actual</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs uppercase text-gray-400">
                <th className="py-2">Producto</th>
                <th className="py-2">Precio</th>
                <th className="py-2">Stock</th>
                <th className="py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {productos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 flex items-center gap-3">
                    <img src={p.imagen} alt="" className="w-10 h-10 object-cover rounded bg-gray-100" />
                    <span className="font-semibold">{p.nombre}</span>
                  </td>
                  <td className="py-3 text-emerald-600 font-bold">${p.precio}</td>
                  <td className="py-3">{p.stock} un.</td>
                  <td className="py-3 text-right">
                    <button onClick={() => eliminar(p.id)}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium text-xs">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}