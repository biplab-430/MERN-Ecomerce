// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter=require("./routes/auth/auth-route")
const adminProductRouter=require('./routes/admin/products')
const ShopProductRouter = require("./routes/shop/products-routes");
const ShopCartRouter = require("./routes/shop/Cart-routes");
const ShopAddressRouter = require("./routes/shop/Address-routes");
const orderRoutes =require('./routes/Order/order-routes')
const AdminorderRoutes =require('./routes/admin/AdminOrder-route')
const SearchRoute =require('./routes/shop/Search-routes')
const ReviewRouter =require('./routes/review/review')
const ChatbotRoute =require('./routes/Chat/Chat')
const FeatureRouter=require("./routes/admin/FeatureRoute")
const ContactRouter=require("./routes/auth/contact-route");
const AdminUserRoute=require("./routes/admin/AdminUser-Route");



const app = express();
const PORT = process.env.PORT || 5000;


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => {
  console.log("✅ MongoDB connected successfully");
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
});

// Middleware
app.use(cors(
    {
        origin:process.env.CLIENT_BASE_URL,
        methods:['GET','POST','DELETE','PUT'],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials:true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',authRouter)
app.use('/api/admin/products',adminProductRouter)
app.use('/api/admin/orders',AdminorderRoutes)
app.use('/api/admin/users',AdminUserRoute)

app.use('/api/admin/feature',FeatureRouter)

app.use('/api/shop/products', ShopProductRouter);
app.use('/api/shop/cart', ShopCartRouter);
app.use('/api/shop/address', ShopAddressRouter);
app.use("/api/shop/order", orderRoutes);
app.use("/api/shop/search", SearchRoute);
app.use("/api/shop/review", ReviewRouter);
app.use("/api/shop/chatbot",ChatbotRoute)
app.use("/api/shop/ContactFrom",ContactRouter)

// Default route
app.get('/', (req, res) => {
  res.send('🚀 E-commerce Server is Running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on ${PORT}`);
});
