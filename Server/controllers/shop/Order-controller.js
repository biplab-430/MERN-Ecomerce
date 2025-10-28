const paypal = require("@paypal/checkout-server-sdk");
const client = require("../../helpers/paypal");
const Order = require("../../Models/Order");
const Cart = require("../../Models/Cart");
const Product= require('../../Models/Product-Model')


// -----------------------------
// Create PayPal Order
// -----------------------------
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      paymentMethod,
      totalAmount,
      orderStatus,
      paymentStatus,
      cartId
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // PayPal order request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.title,
            unit_amount: {
              currency_code: "USD",
              value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
          description: "Order payment via PayPal",
        },
      ],
      application_context: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
    });

    // Execute PayPal order
    const orderResponse = await client().execute(request);

    // Save order in MongoDB
    const newlyCreatedOrder = new Order({
      userId,
      cartItems,
      cartId,
      addressInfo,
      orderStatus: orderStatus || "Pending",
      paymentMethod,
      paymentStatus: paymentStatus || "Pending",
      totalAmount,
      orderDate: new Date(),
      paymentId: orderResponse.result.id, // store PayPal order ID
    });
    await newlyCreatedOrder.save();

    // Get approval URL
    const approvalURL = orderResponse.result.links.find(
      (link) => link.rel === "approve"
    )?.href;

    res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
      message: "PayPal order created successfully",
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------
// Capture PayPal Payment
// -----------------------------
const capturePayment = async (req, res) => {
  try {
    // Read from POST body
    const { orderId, paymentId, payerId } = req.body;

    if (!orderId || !paymentId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing orderId or paymentId" });
    }

    // Find order in DB
    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    // Capture PayPal payment
    const request = new paypal.orders.OrdersCaptureRequest(paymentId);
    request.requestBody({});
    const captureResponse = await client().execute(request);

    const captureResult = captureResponse.result;
    const status = captureResult?.status;
    const paypalPaymentId = captureResult?.id;
    const capturedPayerId = captureResult?.payer?.payer_id || payerId;


    // for stock checking
    for(let item of order.cartItems){
      let product=await Product.findById(item.productId)
      if(!product){
        res.status(404).json({ success: false, message: `not enough stock for this product ${product.title}` });
      }
      product.totalStock-=item.quantity
      await product.save()

    }

    // Delete cart if exists
    if (order.cartId) await Cart.findByIdAndDelete(order.cartId);

    // Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: status === "COMPLETED" ? "Paid" : "Failed",
        orderStatus: status === "COMPLETED" ? "Processing" : "Pending",
        payerId: capturedPayerId,
        orderUpdateDate: new Date(),
        paymentId: paypalPaymentId,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment captured successfully",
      order: updatedOrder,
      paypalResponse: captureResult,
    });
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const getAllOrderByUser=async (req,res)=>{
  try {
    const {userId}=req.params;
    const orders=await Order.find({userId});

    if(!orders.length){
        res.status(404).json({ success: false, message: error.message  });
    }
   res.status(200).json({ success: true,  data:orders})

  } catch (error) {
    console.error("Error fetching all order :", error);
    res.status(500).json({ success: false, message: error.message });
  }
}


const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching order with ID:", id); // debug
    const order = await Order.findById(id);
    console.log("Order found:", order); // debug

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




module.exports = { createOrder, capturePayment,getAllOrderByUser,getOrderDetails };
