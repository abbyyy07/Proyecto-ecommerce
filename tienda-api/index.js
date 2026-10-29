import express from 'express';
import cors from 'cors';

import productosRouter from './routes/productos.js';
import pedidosRouter from './routes/pedidos.js';
import checkoutRouter from './routes/checkout.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());

app.use('/api/productos', productosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.json({ mensaje: '¡API de TiendaNext funcionando correctamente!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API en http://localhost:${PORT}`);
});