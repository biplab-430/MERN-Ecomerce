const Address = require("../../Models/Address")

const addAddress = async (req, res) => {
    try {
        const { userId,
            address,
            city,
            pincode,
            phone,
            notes } = req.body;

        if (!userId || !address || !city || !pincode || !phone || !notes) {
            return res.status(400).json({
                success: false,
                message: "User ID, Product ID, and valid quantity are required",
            });
        }
        const newAddress = new Address({
            userId,
            address,
            city,
            pincode,
            phone,
            notes
        })

        await newAddress.save()
        return res.status(201).json({
            success: true,
            data: newAddress,
            message: "Address creted succeess",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'error'
        })
    }
}
const fetchAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID  required",
            });
        }
        const addressList = await Address.find({ userId })
        return res.status(201).json({
            success: true,
            data: addressList,
            message: "Address creted succeess",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'error'
        })
    }
}
const editAddress = async (req, res) => {
    try {
        const { userId,
            addressId,
        } = req.params;

  const formData=req.body;

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User ID addresid required",
            });
        }
        const address = await Address.findOneAndUpdate({ _id: addressId, userId },formData,{
            new:true
        })
        if(!address){
             return res.status(400).json({
                success: false,
                message: "addres is not find required",
            });
        }
         res.status(201).json({
            success: true,
            data: address,
            message: "Address updated succeess",
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'error'
        })
    }
}

const deleteAddress = async (req, res) => {
    try {
     const { userId,
            addressId,
        } = req.params;
                if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User ID addresid required",
            });
        }
        
         const address= await Address.findOneAndDelete({ _id: addressId, userId  })
           if(!address){
             return res.status(400).json({
                success: false,
                message: "addres is not find ",
            });
        }
         res.status(200).json({
            success: true,
            data: address,
            message: "Address deleted succeess",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'error'
        })
    }
}
module.exports = {
    addAddress, fetchAddress, editAddress, deleteAddress
}