import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeCartItem, updateCartItem } from "@/store/Cart-slice";
import { toast } from "react-toastify";

function UserCartitem({ cartItem }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth)

const {productList} = useSelector(state => state.shopProducts)

  if (!cartItem) return null;

 const handleDeleteCart = async (item) => {
  try {
    const result = await dispatch(
      removeCartItem({ userId: user?.id, productId: item?.productId })
    );

    if (result?.payload?.success) {
      toast.success(`🗑️ ${item.title} removed from cart successfully`);
    } else {
      toast.error(`❌ Failed to remove ${item.title} from cart`);
    }
  } catch (error) {
    toast.error(`❌ Something went wrong while deleting ${item.title}`);
  }
};

const handleUpdateQuantity = async (item, type) => {
  try {
    const productStock = productList.find(
      (product) => product._id === item.productId
    )?.totalStock || 0;

    // Check if we are trying to increase quantity beyond stock
    if (type === "plus" && item.quantity >= productStock) {
      toast.error(`❌ Only ${productStock} units available for "${item.title}"`);
      return;
    }

    const newQuantity =
      type === "plus"
        ? item.quantity + 1
        : Math.max(item.quantity - 1, 1);

    const result = await dispatch(
      updateCartItem({
        userId: user?.id,
        productId: item.productId,
        quantity: newQuantity,
      })
    );

    if (result?.payload?.success) {
      const actionText = type === "plus" ? "added" : "removed";
      toast.success(`✅ ${actionText} ${item.title} successfully`);
    } else {
      toast.error(`❌ Failed to update ${item.title} in cart`);
    }
  } catch (error) {
    toast.error(`❌ Something went wrong with ${item.title}`);
  }
};


  return (
    <div className="flex items-center gap-4 border-b pb-4">
      {/* Product Image */}
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-16 h-16 object-cover rounded"
      />

      {/* Item Details & Quantity */}
      <div className="flex-1">
        <h4 className="font-semibold">{cartItem.title}</h4>
        <div className="flex items-center mt-1 gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full  bg-gray-800 text-white"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>

          <span className="font-semibold">{cartItem?.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full  bg-gray-800 text-white"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>

      {/* Price & Delete */}
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ${((cartItem?.salePrice > 0 ? cartItem.salePrice : cartItem.price) * cartItem.quantity).toFixed(2)}
        </p>
        <Trash className="cursor-pointer mt-1 mr-2 text-red-400 hover:text-red-900"
          onClick={() => handleDeleteCart(cartItem)}
        
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartitem;
