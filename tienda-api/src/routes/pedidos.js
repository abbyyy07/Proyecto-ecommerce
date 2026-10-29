import Express from 'express';
import { pool } from '../db.js';

const router = Express.Router();

router.get('/', async (req, res) => {
  try {
    const email = req.headers['x-user-email'];
    if (!email) return res.status(401).json({ error: 'No autorizado' });

    const [pedidos] = await pool.query(
      `SELECT p.* FROM pedidos p 
       JOIN usuarios u ON p.usuario_id = u.id 
       WHERE u.email = ? ORDER BY p.fecha DESC`,
      [email]
    );

    res.json({ datos: pedidos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;