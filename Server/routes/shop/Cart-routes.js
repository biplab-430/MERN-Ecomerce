const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../../controllers/shop/Cart-Controller");


router.post("/add",  addToCart);
router.get("/get/:userId",  getCart);
router.put("/update-cart", updateCartItem);
router.delete("/:userId/:productId", removeCartItem);

module.exports = router;
