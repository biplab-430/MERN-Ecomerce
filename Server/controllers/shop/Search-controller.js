const Product = require('../../Models/Product-Model');

const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;

        if (!keyword || typeof keyword !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid search keyword"
            });
        }

        const regex = new RegExp(keyword, 'i'); // Case-insensitive search
        const createSearchQuery = {
            $or: [
                { title: regex },
                { description: regex },
                { category: regex },
                { brand: regex },
            ]
        };

        const products = await Product.find(createSearchQuery);

        if (!products.length) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            });
        }

        res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { searchProducts };
