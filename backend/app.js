const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

/* ─── CORS Configuration ─── */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://payment-gateway-js-git-main-chandraathithyams-projects.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`⚠️ CORS blocked for origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

/* ─── Body Parsers ─── */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ─── Health Check ─── */
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '🚀 Razorpay Payment Gateway API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

/* ─── API Routes ─── */
app.use('/api/payment', paymentRoutes);

/* ─── 404 Handler ─── */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

/* ─── Global Error Handler ─── */
app.use(errorHandler);

module.exports = app;
