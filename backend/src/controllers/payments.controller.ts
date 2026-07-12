// paystackInitiate — call initializeTransaction service, return authorization_url to client
// paystackWebhook  — verify transaction via Paystack, activate matching enrollment on success
// stripeInitiate   — call createPaymentIntent service, return clientSecret to client
// stripeWebhook    — verify Stripe webhook signature, activate enrollment on payment_intent.succeeded
