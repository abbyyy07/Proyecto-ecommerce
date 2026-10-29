import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { pool } from '../config/db.js';

const router = Router();
router.use(verificarToken);

router.get('/', async (req, res, next) => {
  try {
    const [items] = await pool.query(
      `SELECT ci.*, p.nombre, p.precio, p.imagen
       FROM carrito_items ci JOIN productos p ON ci.producto_id = p.id
       WHERE ci.usuario_id = ?`, [req.usuario.id]
    );
    res.json({ datos: items });
  } catch(e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { productoId, cantidad = 1 } = req.body;
    await pool.query(
      'INSERT INTO carrito_items (usuario_id, producto_id, cantidad) VALUES (?,?,?) ON DUPLICATE KEY UPDATE cantidad = cantidad + ?',
      [req.usuario.id, productoId, cantidad, cantidad]
    );
    res.status(201).json({ ok: true });
  } catch(e) { next(e); }
});

router.put('/:productoId', async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE carrito_items SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?',
      [req.body.cantidad, req.usuario.id, req.params.productoId]
    );
    res.json({ ok: true });
  } catch(e) { next(e); }
});

router.delete('/:productoId', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM carrito_items WHERE usuario_id = ? AND producto_id = ?',
      [req.usuario.id, req.params.productoId]
    );
    res.status(204).end();
  } catch(e) { next(e); }
});

export default router;