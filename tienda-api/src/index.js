import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import productosRouter from './routes/productos.routes.js';
import categoriasRouter from './routes/categorias.routes.js';
import authRouter from './routes/auth.routes.js';
import carritoRouter from './routes/carrito.routes.js';
import pedidosRouter from './routes/pedidos.js';
import stripeRouter from './routes/stripe.routes.js';
import checkoutRouter from './routes/checkout.js';

const app = express();

app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/auth', authRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/stripe', stripeRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message });
});

app.listen(process.env.PORT, () =>
  console.log(`API en http://localhost:${process.env.PORT}`)
);
app.use('/api/checkout', checkoutRouter);