import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/From";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { updateOrderStatus } from "@/store/admin-slice/Order-Slice";

// Initial form data
const initialFormData = { status: "" };

// ✅ Function to get color classes based on order status
function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-400";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-400";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-400";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-400";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-400";
    default:
      return "bg-gray-100 text-gray-800 border-gray-400";
  }
}

function AdminOrderDetailsView({ order, onStatusUpdate }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [isUpdating, setIsUpdating] = useState(false);
  const { isLoading } = useSelector((state) => state.adminOrders);

  // ✅ Handle form submission
  async function handleUpdateStatus(event) {
    event.preventDefault();

    if (!formData.status) {
      toast.error("Please select an order status.");
      return;
    }

    setIsUpdating(true);
    try {
      const resultAction = await dispatch(
        updateOrderStatus({ id: order._id, orderStatus: formData.status })
      );

      if (updateOrderStatus.fulfilled.match(resultAction)) {
        toast.success("✅ Order status updated successfully!");
        if (onStatusUpdate) onStatusUpdate();
      } else {
        toast.error(resultAction.payload || "Failed to update order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
    } finally {
      setIsUpdating(false);
    }
  }

  if (!order) {
    return (
      <DialogContent className="sm:max-w-[600px]">
        <p className="text-center text-gray-400">No order selected</p>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        {/* Order Info */}
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{order._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>
              {order.orderDate
                ? new Date(order.orderDate).toLocaleDateString()
                : "N/A"}
            </Label>
          </div>
          <div className="flex mt-1 items-center justify-between">
            <p className="font-medium">Total Price</p>
            <Label>₹{order.totalAmount || 0}</Label>
          </div>

          {/* Colored Order Status */}
          <div className="flex mt-1 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                order.orderStatus
              )}`}
            >
              {order.orderStatus || "N/A"}
            </span>
          </div>

          <div className="flex mt-1 items-center justify-between">
            <p className="font-medium">Payment Id</p>
            <Label>{order.paymentId || "N/A"}</Label>
          </div>
          <div className="flex mt-1 items-center justify-between">
            <p className="font-medium">Payer Id</p>
            <Label>{order.payerId || "N/A"}</Label>
          </div>
        </div>

        <Separator />

        {/* Order Items */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {order.cartItems?.length > 0 ? (
                order.cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>₹{item.price}</span>
                  </li>
                ))
              ) : (
                <li>No items found</li>
              )}
            </ul>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground text-sm">
              <span>{order.addressInfo?.address || "N/A"}</span>
              <span>{order.addressInfo?.city || "N/A"}</span>
              <span>{order.addressInfo?.pincode || "N/A"}</span>
              <span>{order.addressInfo?.phone || "N/A"}</span>
              <span>{order.addressInfo?.notes || "No notes"}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Update Status Form */}
        <div className="text-cyan-300">
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "Pending", label: "Pending" },
                  { id: "Processing", label: "Processing" },
                  { id: "Shipped", label: "Shipped" },
                  { id: "Delivered", label: "Delivered" },
                  { id: "Cancelled", label: "Cancelled" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={isUpdating ? "Updating..." : "Update Order Status"}
            onSubmit={handleUpdateStatus}
            disabled={isUpdating || isLoading}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
