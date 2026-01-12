import express from 'express';
import { handleStripeWebhook, createPaymentIntentEndpoint } from '../controllers/paymentController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Webhook endpoint - must be before body parser middleware
// Note: In app.ts, this route needs raw body, not JSON parsed
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Create payment intent
router.post('/create-intent', auth, createPaymentIntentEndpoint);

export default router;
