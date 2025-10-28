import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import AdminOrderDetailsView from "./Order-Details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrderForAdmin,
  getOrderDetailsForAdmin,
  clearOrderDetails,
} from "@/store/admin-slice/Order-Slice";


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

function AdminOrderView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails, isLoading, error } = useSelector(
    (state) => state.adminOrders
  );
  const dispatch = useDispatch();

  // ✅ Fetch all orders when component mounts
  useEffect(() => {
    dispatch(getAllOrderForAdmin());
  }, [dispatch]);

  // ✅ Handle dialog open + load specific order details
  const handleViewDetails = (orderId) => {
    dispatch(getOrderDetailsForAdmin(orderId));
    setOpenDetailsDialog(true);
  };

  // ✅ Handle dialog close and clear previous details
  const handleDialogClose = (open) => {
    if (!open) {
      dispatch(clearOrderDetails());
    }
    setOpenDetailsDialog(open);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && <p>Loading orders...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!isLoading && orderList?.length === 0 && <p>No orders found.</p>}

        {!isLoading && orderList?.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orderList.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  {/* ✅ Colored Status Badge */}
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>
                  </TableCell>

                  <TableCell>₹{order.totalAmount || 0}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={handleDialogClose}
                    >
                      <DialogTrigger asChild>
                        <Button onClick={() => handleViewDetails(order._id)}>
                          View Details
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                          <DialogDescription>
                            Review and update order information
                          </DialogDescription>
                        </DialogHeader>

                        {orderDetails ? (
                          <AdminOrderDetailsView
                            order={orderDetails}
                            onStatusUpdate={() =>
                              dispatch(getAllOrderForAdmin())
                            }
                          />
                        ) : (
                          <p>Loading order details...</p>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminOrderView;
