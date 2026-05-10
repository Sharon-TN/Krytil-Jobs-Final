// import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
// import * as Sentry from "@sentry/node";

import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks } from './controllers/webhooks.js'

import companyRoutes from './routes/companyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import errorHandler from "./middleware/errorHandler.js";

import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

// --------------------
// Initialize app
// --------------------
const app = express();

// --------------------
// GLOBAL MIDDLEWARE (ORDER MATTERS)
// --------------------

// Security headers
app.use(helmet());

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Logging (STEP 6)
app.use(morgan("dev"));

// Auth middleware (moved below public routes)
// app.use(clerkMiddleware());

// Compression (STEP 4)
app.use(compression());

// Rate Limiting (STEP 5)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: process.env.NODE_ENV === 'production' ? 500 : 150, // 500 req/15min in prod
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later."
});

app.use(limiter);

// --------------------
// ROUTES (Public)
// --------------------

app.get('/', (req, res) => {
  res.send("API Working ✅");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth middleware
app.use(clerkMiddleware());

// --------------------
// PROTECTED ROUTES & WEBHOOKS
// --------------------

app.post('/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler (STEP 7)
app.use(errorHandler);

// --------------------
// ERROR HANDLER
// --------------------
// Sentry.setupExpressErrorHandler(app);

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;

console.log("🚀 Starting server...");

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// --------------------
// Connect Services (Non-blocking)
// --------------------
console.log("🔄 Connecting to database...");
connectDB()
  .then(async () => {
    console.log("✅ Database connected successfully");

    // Drop problematic email unique index to prevent E11000 errors
    try {
      const User = (await import('./models/User.js')).default;
      await User.collection.dropIndex('email_1').catch(() => {
        // Index might not exist, that's fine
      });
      console.log("✅ Dropped email unique index (if it existed)");
    } catch (err) {
      console.log("⚠️ Could not drop email index:", err.message);
    }
  })
  .catch(err => console.error("❌ Database connection error:", err));

console.log("🔄 Connecting to Cloudinary...");
connectCloudinary()
  .then(() => console.log("✅ Cloudinary connected successfully"))
  .catch(err => console.error("❌ Cloudinary connection error:", err));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📍 SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
