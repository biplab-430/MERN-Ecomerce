const express = require("express");
const {
  handleImageUpload,
  addProduct,
  getAllProducts,
  deleteProduct,
  editProduct,
} = require("../../controllers/admin/product-Controller");
const { upload } = require("../../helpers/cloudinary");

const Router = express.Router();

// 🔹 Image upload (Cloudinary)
Router.post("/upload-image", upload.single("my-file"), handleImageUpload);

// 🔹 Product CRUD
Router.post("/add", addProduct);        
Router.get("/get", getAllProducts);     
Router.put("/edit/:id", editProduct);    
Router.delete("/delete/:id", deleteProduct);

module.exports = Router;
