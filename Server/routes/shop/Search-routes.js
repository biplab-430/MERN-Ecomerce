const express = require('express');
const router = express.Router();
const { searchProducts } = require('../../controllers/shop/Search-controller');

// Route: GET /api/products/search/:keyword
router.get('/:keyword', searchProducts);

module.exports = router;
