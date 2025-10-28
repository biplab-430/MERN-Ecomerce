const Cart = require("../../Models/Cart");
const Product = require("../../Models/Product-Model");

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "User ID, Product ID, and valid quantity are required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      // Check if product already in cart
      const index = cart.items.findIndex(item => item.productId.toString() === productId);
      if (index === -1) {
        cart.items.push({ productId, quantity });
      } else {
        cart.items[index].quantity += quantity;
      }
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const validItems = cart.items.filter(item => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCart = validItems.map(item => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCart,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update item quantity
const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "User ID, Product ID, and valid quantity are required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(item => item.productId.toString() === productId);
    if (index === -1) return res.status(404).json({ message: "Product not in cart" });

    cart.items[index].quantity = quantity;
    await cart.save();

    await cart.populate({ path: "items.productId", select: "image title price salePrice" });

    const populateCart = cart.items.map(item => ({
      productId: item.productId?._id || null,
      image: item.productId?.image || null,
      title: item.productId?.title || null,
      price: item.productId?.price || null,
      salePrice: item.productId?.salePrice || null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCart,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({ message: "User ID and Product ID are required" });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId && item.productId._id.toString() !== productId);
    await cart.save();

    await cart.populate({ path: "items.productId", select: "image title price salePrice" });

    const populateCart = cart.items.map(item => ({
      productId: item.productId?._id || null,
      image: item.productId?.image || null,
      title: item.productId?.title || null,
      price: item.productId?.price || null,
      salePrice: item.productId?.salePrice || null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCart,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeCartItem };
