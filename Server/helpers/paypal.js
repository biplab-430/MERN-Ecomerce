const paypal = require("@paypal/checkout-server-sdk");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Setup PayPal Environment (Sandbox or Live)
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("❌ PayPal credentials missing in .env file");
  }

  // Sandbox environment (for testing)
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);

  // For production:
  // return new paypal.core.LiveEnvironment(clientId, clientSecret);
}

// Create PayPal Client
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// ✅ Export the client function (not the result yet)
module.exports = client;
