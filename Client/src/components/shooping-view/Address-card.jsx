import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

function Addresscard({addressInfo,handleDEleteAddress,handleEditAddress,setcurrentSelectedAddress,selectedId}) {
  return (
  <Card onClick={setcurrentSelectedAddress?()=>setcurrentSelectedAddress (addressInfo):null}
  className={`cursor-pointer border-red-700 ${selectedId?.id === addressInfo?._id ? "border-red-900 border-[3px]":"border-black"}`}>
    <CardContent className={`${selectedId === addressInfo?._id ? 'border-black':""}grid gap-4 p-4`}>
        <Label>Address: {addressInfo?.address} </Label>
        <Label> City:{addressInfo?.city} </Label>
        <Label>PINCODE: {addressInfo?.pincode} </Label>
        <Label>Phone: {addressInfo?.phone} </Label>
        <Label>Notes: {addressInfo?.notes} </Label>

    </CardContent>
    <CardFooter className="flex justify-between p-3">
        <Button onClick={()=>handleEditAddress(addressInfo)}
        className="text-amber-50">
            Edit
        </Button>
        <Button className="text-amber-50" onClick={()=>handleDEleteAddress(addressInfo)}>
            Delete
        </Button>
    </CardFooter>
  </Card>
  )
}

export default Addresscard
