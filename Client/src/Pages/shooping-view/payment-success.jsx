import React from "react";
import { CheckCircle2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        Payment Successful!
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Thank you for your purchase. Your payment has been successfully processed.
      </p>
      <Button onClick={() => navigate("/shop/orders")}>View It</Button>
    </div>
  );
}

export default PaymentSuccess;
