import Express from 'express';
import Stripe from 'stripe';

const router = Express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/crear-sesion', async (req, res) => {
  try {
    const { items } = req.body;

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.nombre,
          images: item.imagen ? [item.imagen] : [],
        },
        unit_amount: Math.round(item.precio * 100),
      },
      quantity: item.cantidad,
    }));

    // Archivo: tienda-api/src/routes/checkout.js

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: lineItems,
  mode: 'payment',
  
  success_url: `${process.env.FRONTEND_URL}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.FRONTEND_URL}/`,
});

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;