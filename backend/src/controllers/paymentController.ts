import { Request, Response } from 'express';
import stripe from '../config/stripe';
import Order from '../models/Order';

// @desc    Handle Stripe webhook events
// @route   POST /api/payments/webhook
// @access  Public (Stripe webhook)
export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error(`Error handling webhook event: ${error.message}`);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// Handle successful payment
async function handlePaymentSuccess(paymentIntent: any) {
  try {
    // Find order by payment intent ID
    const order = await Order.findOne({
      'paymentInfo.stripePaymentIntentId': paymentIntent.id,
    });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order payment status
    order.paymentInfo.status = 'completed';
    order.paymentInfo.paidAt = new Date().toISOString();
    order.status = 'confirmed';
    await order.save();

    console.log(`✅ Payment successful for order: ${order.orderNumber}`);
  } catch (error: any) {
    console.error(`Error updating order after payment success: ${error.message}`);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailure(paymentIntent: any) {
  try {
    // Find order by payment intent ID
    const order = await Order.findOne({
      'paymentInfo.stripePaymentIntentId': paymentIntent.id,
    });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order payment status
    order.paymentInfo.status = 'failed';
    // Optionally cancel the order or keep it pending for retry
    order.status = 'cancelled';
    await order.save();

    console.log(`❌ Payment failed for order: ${order.orderNumber}`);
  } catch (error: any) {
    console.error(`Error updating order after payment failure: ${error.message}`);
    throw error;
  }
}

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntentEndpoint = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'lkr',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment intent',
    });
  }
};
