const Contact=require("../../Models/Contact-model")

const getAllContacts=async(req,res,next)=>{
try {
   const contacts=await Contact.find()
   if(!contacts || contacts.length===0){
    return res.status(404).json({message:"no contacts are found "})
   }
   res.status(200).json(contacts)
} catch (error) {
     next(error)
}
}
// to delete the contact
const deleteAllContacts = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await Contact.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found or already deleted." });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error); // Make sure you have an error handler middleware
  }
};
module.exports={getAllContacts,deleteAllContacts}