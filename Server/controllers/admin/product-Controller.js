const Product = require('../../Models/Product-Model')
const { v2: cloudinary } = require("cloudinary");
const { ImageUploadUtils } = require("../../helpers/cloudinary");

// ✅ Upload image
const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Convert buffer to base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await ImageUploadUtils(url);

    res.status(200).json({
      success: true,
      result,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

// ✅ Add a product
const addProduct = async (req, res) => {
  try {
    let { image, title, description, price, salePrice, category, brand, totalStock } = req.body;

    if (!title || !description || !price || !category || !brand || !image) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 🔑 Convert strings to numbers safely
price = Number(price);
salePrice = salePrice !== undefined && salePrice !== "" ? Number(salePrice) : null;
totalStock = totalStock !== undefined && totalStock !== "" ? Number(totalStock) : 0;


    const Newproduct = new Product({
      image,
      title,
      description,
      price,
      salePrice,
      category,
      brand,
      totalStock,
    });

    await Newproduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: Newproduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};

// ✅ Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const Listproducts = await Product.find();
    res.status(200).json({ success: true, data: Listproducts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ✅ Edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { image, title, description, price, salePrice, category, brand, totalStock } = req.body;

    // 🔑 Convert values if they exist
    const updateData = {};
    if (image) updateData.image = image;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
   if (salePrice !== undefined) updateData.salePrice = Number(salePrice);
if (totalStock !== undefined) updateData.totalStock = Number(totalStock);
if (category) updateData.category = category;
    if (brand) updateData.brand = brand;
   

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,           // return updated document
      runValidators: true, // apply schema validations
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ✅ Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  getAllProducts,
  editProduct,
  deleteProduct,
};
