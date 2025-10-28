const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// Create the collection
const Contact = model("Contact", contactSchema);

// Export
module.exports = Contact;
