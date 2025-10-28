const Order = require("../../Models/Order");

// ✅ Fetch all orders of all users (Admin access)
const getAllOrderOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

    // 🛠 Fix: `error.message` was undefined here (no 'error' variable)
    if (!orders || orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No orders found." 
      });
    }

    res.status(200).json({ 
      success: true,  
      data: orders 
    });

  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


// ✅ Fetch single order details for Admin (by ID)
const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching order with ID:", id);

    // 🛠 Fix: use findById directly (don’t wrap id in object)
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found." 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: order 
    });

  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required.",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true } // ✅ returns the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: updatedOrder, // ✅ return the updated order
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


module.exports = { 
  getAllOrderOfAllUsers, 
  getOrderDetailsForAdmin ,
  updateOrderStatus
};
