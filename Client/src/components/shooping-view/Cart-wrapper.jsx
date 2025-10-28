import React from "react";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartitem from "./Cart-item";
import { useNavigate } from "react-router-dom";

function UserCartWrapper({ cartItems = [],setOpenCartSheet }) {
  const navigate=useNavigate()
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item?.salePrice > 0 ? item.salePrice : item?.price || 0;
    return sum + price * (item?.quantity || 1);
  }, 0);


  return (
    <SheetContent className="sm:max-w-md flex flex-col h-full" aria-describedby="cart-description">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
        <SheetDescription id="cart-description">
          Review your items and proceed to checkout.
        </SheetDescription>
      </SheetHeader>

      {/* Scrollable Cart Items */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map(item => <UserCartitem key={item._id} cartItem={item} />)
        ) : (
          <p className="text-center text-muted-foreground">Your cart is empty</p>
        )}
      </div>

      {/* Total & Checkout (always visible) */}
      <div className="mt-4 border-t pt-4 flex flex-col gap-4">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <Button onClick={()=>{setOpenCartSheet(false)
          navigate("/shop/check")}}
         className="w-full mt-6" disabled={cartItems.length === 0}>
          Check Out
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
