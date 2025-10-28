const express=require("express");
const router=express.Router();
const contactForm = require("../../controllers/auth/contact-controller");
const {getAllContacts,deleteAllContacts} =require("../../controllers/admin/adminContact")


router.route("/contact").post(contactForm)
router.route('/all').get(getAllContacts)
router.route('/contacts/delete/:id').delete(deleteAllContacts)

module.exports=router;