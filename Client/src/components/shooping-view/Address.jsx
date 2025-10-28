import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/From";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "@/store/Address-slice";
import Addresscard from "./Address-card";
import { toast } from "react-toastify";

const initialAddressFormdata = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

function Address({setcurrentSelectedAddress,selectedId}) {
  const [formData, setFromData] = useState(initialAddressFormdata);
  const [currentEditedId, setcurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { AddressList } = useSelector((state) => state.shopAddress);

  function handleManageAddress(event) {
    event.preventDefault();

    if(AddressList .length>=3 && currentEditedId === null){
      setFromData(initialAddressFormdata)
      toast.error("More Than 3 Address Is Not Accepted.");
      return;
    }

    if (currentEditedId !== null) {
      // Edit address
      dispatch(
        editAddress({
          userId: user?.id,
          addressId: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress(user?.id));
          toast.success("Address updated successfully!");
          setcurrentEditedId(null);
          setFromData(initialAddressFormdata);
        } else {
          toast.error("Failed to update address.");
        }
      });
    } else {
      // Add new address
      dispatch(
        addNewAddress({
          ...formData,
          userId: user?.id,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress(user?.id));
          toast.success("Address added successfully!");
          setFromData(initialAddressFormdata);
        } else {
          toast.error("Failed to add address.");
        }
      });
    }
  }

  function handleEditAddress(getCurrentAddress) {
    setcurrentEditedId(getCurrentAddress?._id);
    setFromData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      pincode: getCurrentAddress?.pincode,
      phone: getCurrentAddress?.phone,
      notes: getCurrentAddress?.notes,
    });
  }

  function handleDEleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress?._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress(user?.id));
        toast.success("Address deleted successfully!");
      } else {
        toast.error("Failed to delete address.");
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => {
        const value = formData[key];
        return typeof value === "string" ? value.trim() !== "" : false;
      })
      .every((item) => item);
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddress(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {AddressList && AddressList.length > 0
          ? AddressList.map((singleaddressItem) => (
              <Addresscard 
              selectedId={selectedId}
                setcurrentEditedId={setcurrentEditedId}
                setFormData={setFromData}
                handleDEleteAddress={handleDEleteAddress}
                key={singleaddressItem._id} // ✅ Added key prop
                handleEditAddress={handleEditAddress}
                addressInfo={singleaddressItem}
                setcurrentSelectedAddress={setcurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFromData}
          buttonText={currentEditedId !== null ? "Edit " : "Add New "}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
