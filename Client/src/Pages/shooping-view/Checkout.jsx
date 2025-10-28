import React, { useState } from 'react';
import accimg from "../../assets/WhatsApp Image 2025-10-03 at 12.15.12_9a91b044.jpg";
import Address from '@/components/shooping-view/Address';
import { useDispatch, useSelector } from 'react-redux';
import UserCartitem from '@/components/shooping-view/Cart-item';
import { Button } from '@/components/ui/button';
import { createNewOrder } from '@/store/Order-slice';
import { toast } from "react-toastify";

function Checkout() {
  const { cartItems } = useSelector((state) => state.shopCart)
  const { user } = useSelector((state) => state.auth)
  const [currentSelectedAddress,setcurrentSelectedAddress]=useState(null)
  const [isPaymentStart,setisPaymentStart]=useState(false)
  const {approvalURl}=useSelector((state)=>state.shopOrder)
  const dispatch=useDispatch()
  const cartItemsArray = Array.isArray(cartItems) ? cartItems : cartItems?.items || [];

  const totalPrice = cartItemsArray.reduce((sum, item) => {
    const price = item?.salePrice > 0 ? item.salePrice : item?.price || 0;
    return sum + price * (item?.quantity || 1);
  }, 0);
    

function handleInitiatePaypalPayment(){

 if(cartItems.length ===0){
    toast.error("❌ Your Cart Is empty")
 } 

if(currentSelectedAddress === null){
  ///return a toast
 toast.error("❌ Please Select A address")

}

  const orderData={
     userId:user?.id,
     cartId:cartItems?._id,
      cartItems:cartItemsArray.map(singleCartItem=>({
          productId:singleCartItem.productId,
        title:singleCartItem.title,
        image:singleCartItem.image,
        price:singleCartItem.salePrice>0 ?singleCartItem.salePrice:singleCartItem.price,
       quantity:singleCartItem.quantity
      })),
      addressInfo:{
         addressId:currentSelectedAddress?.id,
    address:currentSelectedAddress?.address,
     city:currentSelectedAddress?.city,
   pincode:currentSelectedAddress?.pincode,
   phone:currentSelectedAddress?.phone,
   notes:currentSelectedAddress?.notes
      },
      paymentMethod:'paypal',
      totalAmount:totalPrice,
      orderStatus:'pending',
      paymentStatus:'pending',
}
 dispatch(createNewOrder(orderData)).then((data)=>{
  console.log(data,'biplab')
  if(data?.payload?.success){
    setisPaymentStart(true)
  }else{
    setisPaymentStart(false)
  }
 
 })

}

if(approvalURl){
  window.location.href=approvalURl
}

  // Ensure cartItems is always an array
 

  return (
    <div className='flex flex-col'>
      {/* 🔹 Full screen width banner */}
      <div className="w-screen">
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            src={accimg}
            className="h-full w-full object-cover object-center"
            alt="account-banner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        {/* Address section with toast notifications */}
        <Address selectedId={currentSelectedAddress} setcurrentSelectedAddress={setcurrentSelectedAddress} />

        {/* Cart items and total */}
        <div className="flex flex-col gap-4">
          {cartItemsArray.length > 0 ? (
            cartItemsArray.map((item) => (
              <UserCartitem key={item._id || item.id} cartItem={item} />
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}

          {/* Total price */}
          <div className="mt-8 space-y-8">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout button */}
          <div className='mt-4 w-full'>
            <Button onClick={handleInitiatePaypalPayment}
             className="w-full text-amber-50 bg-amber-600 hover:bg-amber-700">
              Checkout with Paypal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
