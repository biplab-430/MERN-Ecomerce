import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';
import ShoopingOrderDetailsView from './Order-Details';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrderByUserId } from '@/store/Order-slice';
import { Badge } from '../ui/badge';

function ShoopingOrder() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrderByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell>{orderItem._id}</TableCell>
                  <TableCell>
                    {orderItem?.orderDate
                      ? new Date(orderItem.orderDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 text-white ${getStatusColor(
                        orderItem.orderStatus
                      )}`}
                    >
                      {orderItem.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{orderItem.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog && selectedOrder === orderItem._id}
                      onOpenChange={(open) => {
                        if (!open) setSelectedOrder(null);
                        setOpenDetailsDialog(open);
                      }}
                    >
                      <Button
                        onClick={() => {
                          setSelectedOrder(orderItem._id);
                          setOpenDetailsDialog(true);
                        }}
                      >
                        View Details
                      </Button>

                      {openDetailsDialog && selectedOrder === orderItem._id && (
                        <ShoopingOrderDetailsView
                          order={orderList.find((o) => o._id === selectedOrder)}
                        />
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5" className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoopingOrder;
