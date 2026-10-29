import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const router = Router();

function generarTokens(usuario) {
  const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  const refresh = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
  return { token, refresh };
}

router.post('/registro', async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?,?,?)', [nombre, email, hash]
    );
    const usuario = { id: r.insertId, nombre, email, rol: 'cliente' };
    res.status(201).json({ datos: { ...usuario, ...generarTokens(usuario) } });
  } catch(e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'El email ya está registrado' });
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [filas] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (!filas.length) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const u = filas[0];
    if (!u.password_hash || !(await bcrypt.compare(password, u.password_hash)))
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    res.json({ datos: { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, ...generarTokens(u) } });
  } catch(e) { next(e); }
});

router.post('/google', async (req, res, next) => {
  try {
    const payload = JSON.parse(Buffer.from(req.body.token.split('.')[1], 'base64').toString());
    const { name, email } = payload;

    let [filas] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    let u;
    if (filas.length) {
      u = filas[0];
    } else {
      const [r] = await pool.query(
        "INSERT INTO usuarios (nombre, email, proveedor) VALUES (?,?,'google')", [name, email]
      );
      u = { id: r.insertId, nombre: name, email, rol: 'cliente' };
    }
    res.json({ datos: { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, ...generarTokens(u) } });
  } catch(e) { next(e); }
});

export default router;