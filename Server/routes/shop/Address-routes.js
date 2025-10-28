const express = require("express");
const router = express.Router();
const {
  addAddress,
  fetchAddress,
  editAddress,
  deleteAddress
  
} = require("../../controllers/shop/Address-controller");


router.post("/add", addAddress);
router.get("/get/:userId",  fetchAddress);
router.put("/update/:userId/:addressId", editAddress);
router.delete("/delete/:userId/:addressId", deleteAddress);

module.exports = router;
