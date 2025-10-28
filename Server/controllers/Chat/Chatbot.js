const Product = require("../../Models/Product-Model");
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERA_SECRET_API_KEY,
});

const chatbotHelp = async (req, res) => {
  const { message } = req.body;

  try {
    const lowerMsg = message.toLowerCase();

    // ✅ Detect intent
    const isPriceQuery = lowerMsg.includes("price") || lowerMsg.includes("cost");
    const isStockQuery = lowerMsg.includes("stock") || lowerMsg.includes("available");
    const isBrandQuery = lowerMsg.includes("brand");
    const isCategoryQuery = lowerMsg.includes("category");

    // ✅ Extract possible product name (remove words like "price", "of", "the", etc.)
    const productQuery = lowerMsg
      .replace(/price|cost|stock|available|brand|category|of|the|please|tell|about/gi, "")
      .trim();

    // If message is just a keyword like “kurta” → search that
    const searchTerm = productQuery || message;

    // ✅ Find product(s)
    const products = await Product.find({
      title: { $regex: searchTerm, $options: "i" },
    }).limit(3);

    if (!products.length) {
      return res.json({
        success: true,
        reply: "Sorry, I couldn't find any matching product.",
      });
    }

    let formattedProducts;

    // ✅ Respond based on detected intent
    if (isPriceQuery) {
      formattedProducts = products.map((p) => ({
        name: p.title,
        price: p.price,
      }));
    } else if (isStockQuery) {
      formattedProducts = products.map((p) => ({
        name: p.title,
        stock: p.totalStock,
      }));
    } else if (isBrandQuery) {
      formattedProducts = products.map((p) => ({
        name: p.title,
        brand: p.brand,
      }));
    } else if (isCategoryQuery) {
      formattedProducts = products.map((p) => ({
        name: p.title,
        category: p.category,
      }));
    } else {
      // General query → all details
      formattedProducts = products.map((p) => ({
        name: p.title,
        price: p.price,
        stock: p.totalStock,
        brand: p.brand,
        category: p.category,
        description: p.description,
      }));
    }

    const context = `Product Info:\n${JSON.stringify(formattedProducts, null, 2)}\n`;

    const prompt = `
You are a helpful AI assistant for an e-commerce store.

If the user asks about:
- product price → respond using 'price' field
- product stock → respond using 'stock' field
- product brand → respond using 'brand' field
- product category → respond using 'category' field
- if only product name is mentioned → respond with all product details (price, stock, brand, category, description)
If product not found → say: "Sorry, I couldn't find any matching product."

Keep the response short, friendly, and accurate.

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
    console.error("Chatbot Error Details:", error?.response?.body || error);
    res.status(500).json({
      success: false,
      message: "Something went wrong with the chatbot.",
      error: error.message,
    });
  }
};

module.exports = { chatbotHelp };
