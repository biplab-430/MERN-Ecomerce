import React from "react";
import accimg from "../../assets/WhatsApp Image 2025-10-03 at 12.15.12_9a91b044.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShoopingOrder from "@/components/shooping-view/Order";
import Address from "@/components/shooping-view/Address";

function Account() {
  return (
    <div className="flex flex-col">
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

      {/* 🔹 Account tabs section */}
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders" className="text-amber-100">
                ORDERS
              </TabsTrigger>
              <TabsTrigger value="address" className="text-amber-100">
                ADDRESS
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoopingOrder />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Account;
