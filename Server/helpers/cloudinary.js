const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memoryStorage to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Utility function to upload buffer to Cloudinary
async function ImageUploadUtils(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "uploads" }, // optional: folder
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
}

module.exports = { upload, ImageUploadUtils };
