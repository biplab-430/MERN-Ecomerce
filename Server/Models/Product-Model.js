const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
      image: {
        type: String, // ✅ single image URL
        required: true,
      },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 100,
    },
    salePrice: {
      type: Number,
      min: 0,
      default: null, // optional field
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
   
    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
