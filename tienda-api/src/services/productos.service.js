import { pool } from '../config/db.js';

export async function listar(query) {
  let sql = 'SELECT p.*, c.nombre as categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id';
  const condiciones = [];
  const params = [];

  if (query.categoria) { condiciones.push('c.slug = ?'); params.push(query.categoria); }
  if (query.buscar) { condiciones.push('p.nombre LIKE ?'); params.push(`%${query.buscar}%`); }
  if (query.destacado) { condiciones.push('p.destacado = TRUE'); }
  if (condiciones.length) sql += ' WHERE ' + condiciones.join(' AND ');
  if (query.orden === 'precio') sql += ' ORDER BY p.precio';
  else sql += ' ORDER BY p.creado_en DESC';

  const [filas] = await pool.query(sql, params);
  return filas;
}

export async function obtenerPorId(id) {
  const [filas] = await pool.query('SELECT p.*, c.nombre as categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = ?', [id]);
  if (!filas.length) { const e = new Error('Producto no encontrado'); e.status = 404; throw e; }
  return filas[0];
}

export async function crear(datos) {
  const [r] = await pool.query('INSERT INTO productos SET ?', [datos]);
  return obtenerPorId(r.insertId);
}

export async function actualizar(id, datos) {
  await pool.query('UPDATE productos SET ? WHERE id = ?', [datos, id]);
  return obtenerPorId(id);
}

export async function eliminar(id) {
  await obtenerPorId(id);
  await pool.query('DELETE FROM productos WHERE id = ?', [id]);
}