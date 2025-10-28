import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { clearSearchResults, getSearchResults } from "@/store/Search-slice";
import { addToCart, getCartItems } from "@/store/Cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ShopProductTile from "./Product-Tile";
import { Button } from "@/components/ui/button";
import { fetchAllShopProducts, fetchProductsDetails } from "@/store/Product-slice";
import { toast } from "react-toastify";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { productList } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [allProducts, setAllProducts] = useState([]);

  // ---------------- Fetch all products on first load ----------------
  useEffect(() => {
    dispatch(fetchAllShopProducts());
  }, [dispatch]);

  // ---------------- Update local allProducts when Redux productList changes ----------------
  useEffect(() => {
    setAllProducts(productList);
  }, [productList]);

  // ---------------- Debounced search effect ----------------
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const trimmed = keyword.trim();

      if (trimmed.length >= 3) {
        setSearchParams({ keyword: trimmed });
        dispatch(getSearchResults(trimmed)); // fetch search results
      } else {
        setSearchParams({});
        dispatch(clearSearchResults());
        dispatch(fetchAllShopProducts());
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [keyword, dispatch, setSearchParams]);

  // ---------------- Add to Cart ----------------
  const handleAddToCart = (productId, totalStock) => {
    const currentCart = cartItems.items || [];
    const index = currentCart.findIndex((item) => item.productId === productId);

    if (index > -1 && currentCart[index].quantity + 1 > totalStock) {
      toast.error(`Only ${totalStock} quantity can be added for this item`);
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getCartItems(user?.id));
          toast.success("✅ Product added to cart!");
        } else {
          toast.error("❌ Failed to add product to cart");
        }
      });
  };

  // ---------------- Product details ----------------
  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductsDetails(productId));
  };

  // ---------------- Determine products to render ----------------
  const productsToRender =
    keyword.trim() !== "" && searchResults?.length > 0
      ? searchResults
      : allProducts;

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      {/* Search Input */}
      {/* Full-width Search Bar */}
{/* Full-width Search Bar */}
<div className="w-full bg-white shadow-md py-8 flex justify-center sticky top-0 z-20">
  <div className="w-full max-w-6xl flex items-center relative px-4">
    <Input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      className="w-full py-6 pr-14 pl-6 text-lg rounded-full border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-300 transition-all"
      placeholder="Search products..."
    />
    <Button
      onClick={() => keyword.trim().length >= 3 && dispatch(getSearchResults(keyword.trim()))}
      className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-800 hover:bg-gray-700"
      variant="ghost"
    >
      <Search className="w-5 h-5 text-white" />
    </Button>
  </div>
</div>



      {/* Loading */}
      {isLoading && (
        <p className="text-center text-gray-500 text-lg animate-pulse mb-6">
          Searching products...
        </p>
      )}

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsToRender && productsToRender.length > 0 ? (
              productsToRender.map((product) => (
                <ShopProductTile
                  key={product._id}
                  product={product}
                  handleGetProductDetail={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <p className="text-center col-span-full text-muted-foreground">
                No products found
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SearchProducts;
