import React from 'react';
import { DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { useSelector } from 'react-redux';

function ShoopingOrderDetailsView({ order }) {
     const { user } = useSelector((state) => state.auth);
  if (!order) return null;

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>Order Details</DialogTitle>
      <DialogDescription>
        Summary of your order and shipping information
      </DialogDescription>

      <div className="grid gap-6">
        {/* Basic Info */}
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order Id</p>
            <Label>{order._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>₹{order.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>{order.orderStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Methiod</p>
            <Label>{order.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{order.paymentStatus}</Label>
          </div>
        </div>

        <Separator />

        {/* Products */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Products</div>
            <ul className="grid gap-3">
              {order.cartItems?.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{item.title} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        {/* Shipping Info */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
                <span>{user?.userName}</span>
              <span>{order.addressInfo?.address}</span>
              <span>{order.addressInfo?.city}</span>
              <span>{order.addressInfo?.pincode}</span>
              <span>{order.addressInfo?.phone}</span>
              <span>{order.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoopingOrderDetailsView;
