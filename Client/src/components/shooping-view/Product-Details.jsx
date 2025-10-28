import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { addToCart, getCartItems } from "@/store/Cart-slice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "@/store/Product-slice";
import { Label } from "../ui/label";
// import StarratingComponent from "../common/Star-rating";
import { addReview, getReviews } from "@/store/Review-Slice"; // ✅ Import getReviews
import StarratingComponent from "../common/Star-rating";
import AverageRatingDisplay from "../common/Avg-rating";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview); // ✅ Get reviews from redux
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  // ✅ Fetch all reviews when dialog opens and productDetails exist
  useEffect(() => {
    if (open && productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [open, productDetails, dispatch]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  // ✅ Add review and refresh list
  function handleAddreview() {
    if (!user?.id) {
      toast.error("Please login to write a review!");
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Review added successfully!");
        dispatch(getReviews(productDetails._id)); // ✅ Refresh reviews
        setReviewMsg("");
        setRating(0);
      } else {
        toast.error(data?.payload || "Failed to add review");
      }
    });
  }

  // ✅ Safe guard for missing product details
  const hasDetails = !!productDetails;

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!user?.id) {
      toast.error("Please log in to add items to your cart");
      return;
    }
    let getcartItem = cartItems.items || [];
    if (getcartItem.length) {
      const indexOfCurrentItem = getcartItem.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getcartItem[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`only ${getQuantity} quantity can be added for this item`);
          return;
        }
      }
    }

    dispatch(
      addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getCartItems(user?.id));
        toast.success("✅ Product added to cart!");
      } else {
        toast.error("❌ Failed to add product to cart");
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails(null)); // ✅ reset to null safely
    setRating(0);
    setReviewMsg("");
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-10 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto">
        {!hasDetails ? (
          <div className="flex justify-center items-center w-full col-span-2 p-10">
            <p className="text-muted-foreground text-lg animate-pulse">
              Loading product details...
            </p>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={productDetails?.image}
                alt={productDetails?.title || "Product"}
                width={600}
                height={600}
                className="aspect-square w-full object-cover"
              />
            </div>

            <div className="grid gap-6">
              <DialogHeader>
                <DialogTitle>{productDetails?.title}</DialogTitle>
                <DialogDescription>
                  {productDetails?.description?.slice(0, 100) || "Product details"}
                </DialogDescription>
              </DialogHeader>

              <div>
                <h1 className="text-3xl font-extrabold">
                  {productDetails?.title}
                </h1>
                <p className="text-muted-foreground text-2xl mb-5 mt-4">
                  {productDetails?.description}
                </p>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-lg font-semibold ${
                    productDetails?.salePrice > 0
                      ? "line-through text-muted-foreground"
                      : "text-primary"
                  }`}
                >
                  ₹{productDetails?.price}
                </span>

                {productDetails?.salePrice > 0 && (
                  <span className="text-lg font-bold text-primary">
                    ₹{productDetails?.salePrice}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                {/* <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-primary" />
                  ))}
                </div> */}
               <div className="flex items-center gap-2 mt-2">
  <AverageRatingDisplay productId={productDetails?._id} />
</div>

              </div>

              <div className="mt-5 mb-5">
                {productDetails?.totalStock === 0 ? (
                  <Button className="w-full opacity-60 cursor-not-allowed">
                    Out Of Stock
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleAddToCart(productDetails?._id, productDetails?.totalStock)
                    }
                  >
                    Add to Cart
                  </Button>
                )}
              </div>

              <Separator />

              {/* ✅ Dynamic Reviews Section */}
              <div className="max-h-[300px] overflow-auto">
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                <div className="grid gap-6">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={index} className="flex gap-4">
                        <Avatar className="w-10 h-10 border">
                          <AvatarFallback>
                            {review.userName?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{review.userName}</h3>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <StarIcon
                                key={j}
                                className={`w-5 h-5 ${
                                  j < review.reviewValue
                                    ? "fill-yellow-400"
                                    : "fill-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">
                            {review.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No reviews yet.</p>
                  )}
                </div>

                {/* Review Input */}
                <div className="mt-10 flex-col gap-2">
                  <Label>Write a review</Label>
                  <div className="flex gap-0.1">
                    <StarratingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="Write a review..."
                  />
                  <Button
                    onClick={handleAddreview}
                    className="mt-2"
                    disabled={reviewMsg.trim() === ""}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
