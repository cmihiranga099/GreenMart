import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey || stripeSecretKey === 'sk_test_your_stripe_secret_key') {
  throw new Error(
    'STRIPE_SECRET_KEY is not configured in .env file. Please add your Stripe secret key.'
  );
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

export default stripe;
