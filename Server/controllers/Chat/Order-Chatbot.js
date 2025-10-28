const Order = require("../../Models/Order");
const User = require("../../Models/User");
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERA_SECRET_API_KEY,
});

const orderChatbotHelp = async (req, res) => {
  const { message, user } = req.body;

  try {
    // ✅ Get user data and orders
    const userData = await User.findById(user._id);
    if (!userData) {
      return res.json({
        success: false,
        reply: "I couldn’t find your account. Please log in first.",
      });
    }

    const orders = await Order.find({ userId: user._id });

    if (!orders.length) {
      return res.json({
        success: true,
        reply: "You have not placed any orders yet.",
      });
    }

    const lowerMsg = message.toLowerCase();
    const lastOrder = orders[orders.length - 1];
    const totalOrders = orders.length;
    const totalPrice = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    let context = "";
    let formattedOrders;

    // ✅ Check what user is asking
    if (lowerMsg.includes("last")) {
      formattedOrders = {
        id: lastOrder._id,
        total: lastOrder.totalAmount,
        status: lastOrder.status,
        date: lastOrder.createdAt,
      };
      context = `Last Order Info:\n${JSON.stringify(formattedOrders, null, 2)}\n`;
    } else if (lowerMsg.includes("total") || lowerMsg.includes("how many")) {
      context = `You have placed ${totalOrders} orders.`;
    } else if (lowerMsg.includes("price") || lowerMsg.includes("amount")) {
      context = `Your total spending on all orders is ₹${totalPrice}.`;
    } else {
      formattedOrders = orders.map((o) => ({
        id: o._id,
        total: o.totalAmount,
        status: o.status,
        date: o.createdAt,
      }));
      context = `Your Orders:\n${JSON.stringify(formattedOrders, null, 2)}\n`;
    }

    const prompt = `
You are a helpful AI assistant for an e-commerce store.

If user asks about:
- their last order → use 'Last Order Info'
- total number of orders → use the count
- total price → show combined totalAmount
- general order info → list basic details
If user not found → ask them to log in.

Keep your response short, friendly, and clear.

Context:
${context}

User Message:
${message}
`;

    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: prompt,
    });

    const reply = response.text.trim();
    res.json({ success: true, reply });
  } catch (error) {
    console.error("Order Chatbot Error:", error?.response?.body || error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching your orders.",
      error: error.message,
    });
  }
};

module.exports = { orderChatbotHelp };
