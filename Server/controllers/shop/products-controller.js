const Product = require("../../Models/Product-Model");

const getFilteredProducts = async (req, res) => {
  try {
    // Get query params
    let { category = "", brand = "", sortBy = "price_asc" } = req.query;

    // Normalize category and brand to arrays
    const categories = typeof category === "string" && category ? category.split(",") : [];
    const brands = typeof brand === "string" && brand ? brand.split(",") : [];

    // Build filters object
    let filters = {};
    if (categories.length) filters.category = { $in: categories };
    if (brands.length) filters.brand = { $in: brands };

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case "price_asc":
        sort.price = 1;
        break;
      case "price_desc":
        sort.price = -1;
        break;
      case "name_asc":
        sort.title = 1;
        break;
      case "name_desc":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
    }

    // Fetch products from DB
    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProductDetails=async(req,res)=>{
  try {
    const {id}= req.params;
    const product=await Product.findById(id)
     if(!product) return  res.status(404).json({
      success:false,
      message:'product not found'
     })
     res.status(200).json({
      success:true,
        data:product
     })


  }catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = { getFilteredProducts ,getProductDetails};
