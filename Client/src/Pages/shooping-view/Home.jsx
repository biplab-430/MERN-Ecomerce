import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Baby, ChevronLeftIcon, ChevronRightIcon, CloudLightning, ShirtIcon, UmbrellaIcon, WatchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { SiNike, SiAdidas, SiPuma, SiZara } from "react-icons/si";
import { toast } from "react-toastify";
import { fetchAllShopProducts, fetchProductsDetails } from '@/store/Product-slice';
import ShopProductTile from './Product-Tile';
import { useNavigate } from 'react-router-dom';
import { addToCart, getCartItems } from '@/store/Cart-slice';
import { getFeatureImages } from '@/store/admin-slice/DashBoard-Slice';

function Home() {
  // const slides = [bannerTwo, bannerThree, bannerOne];


  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { user } = useSelector(state => state.auth);
  const { productList } = useSelector(state => state.shopProducts);
  const { cartItems } = useSelector(state => state.shopCart);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  // ---------------- Categories ----------------
  const categoriesWithIcon = [
    { id: 'men', label: 'Men', icon: ShirtIcon },
    { id: 'women', label: 'Women', icon: CloudLightning },
    { id: 'kids', label: 'Kids', icon: Baby },
    { id: 'accessories', label: 'Accessories', icon: WatchIcon },
    { id: 'footwear', label: 'Footwear', icon: UmbrellaIcon },
  ];

  // ---------------- Brands ----------------
  const brandWithIcon = [
    { id: "nike", label: "Nike", icon: <SiNike className="w-12 h-12 mb-4 text-primary" /> },
    { id: "adidas", label: "Adidas", icon: <SiAdidas className="w-12 h-12 mb-4 text-primary" /> },
    { id: "puma", label: "Puma", icon: <SiPuma className="w-12 h-12 mb-4 text-primary" /> },
    { id: "zara", label: "Zara", icon: <SiZara className="w-12 h-12 mb-4 text-primary" /> },
    { id: "hm", label: "H&M", icon: <span className="text-2xl font-bold text-red-600">H&amp;M</span> },
    { id: "levis", label: "Levi's", icon: <span className="text-2xl font-bold text-red-600">Levi’s</span> },
  ];

  // ---------------- Banner Slider ----------------
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featureImageList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featureImageList]);

  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + featureImageList.length) % featureImageList.length);
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % featureImageList.length);

  // ---------------- Fetch Products ----------------
  useEffect(() => {
    dispatch(fetchAllShopProducts({ filterParams: {}, sortParams: 'low to high' }));
  }, [dispatch]);

  // ---------------- Navigate to Listing Page ----------------
  function handleNavigateListingpage(item, section) {
    // section = 'category' or 'brand'
    const filters = JSON.parse(sessionStorage.getItem('filters')) || { categories: [], brands: [] };
    if (section === 'category') filters.categories = [item.id];
    else filters.brands = [item.id];

    sessionStorage.setItem('filters', JSON.stringify(filters));
    navigate('/shop/list');
  }

  // ---------------- Product Details ----------------
  function handleGetProductDetails(productId) {
    dispatch(fetchProductsDetails(productId));
  }

  // ---------------- Add to Cart ----------------
  function handleAddToCart(productId, totalStock) {
    let currentCart = cartItems.items || [];
    const index = currentCart.findIndex(item => item.productId === productId);

    if (index > -1 && currentCart[index].quantity + 1 > totalStock) {
      toast.error(`Only ${currentCart[index].quantity} quantity can be added for this item`);
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 }))
      .then(data => {
        if (data?.payload?.success) {
          dispatch(getCartItems(user?.id));
          toast.success("✅ Product added to cart!");
        } else {
          toast.error("❌ Failed to add product to cart");
        }
      });
  }

  // for admin control home page slide
   useEffect(() => {
      dispatch(getFeatureImages());
    }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden">

      {/* Banner Slider */}
      <div className="relative w-screen h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length>0?featureImageList.map((slide, index) => (
          <img
            key={index}
            src={slide?.image}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          />
        )) :null}

        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
          onClick={prevSlide}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
          onClick={nextSlide}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Shop By Category */}
      <section className="p-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map(category => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => handleNavigateListingpage(category, 'category')}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <category.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{category.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Brand */}
      <section className="p-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brandWithIcon.map(brand => (
              <Card
                key={brand.id}
                className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => handleNavigateListingpage(brand, 'brand')}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {brand.icon}
                  <span className="font-bold">{brand.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0 ? (
              productList.map(product => (
                <ShopProductTile
                  key={product._id}
                  product={product}
                  handleGetProductDetail={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <p className="text-center col-span-full text-muted-foreground">No products found</p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
