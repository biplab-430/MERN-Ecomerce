const Features = require("../../Models/Features");

// ✅ Add Feature Image
const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const featureImage = new Features({ image });
    await featureImage.save();

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: featureImage,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

// ✅ Get All Feature Images
const getFeatureImage = async (req, res) => {
  try {
    const images = await Features.find({});
    res.status(200).json({
      success: true,
      message: "Images fetched successfully",
      data: images,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
      error: error.message,
    });
  }
};

// ✅ Delete Feature Image by ID
const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedImage = await Features.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: deletedImage,
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

module.exports = {
  addFeatureImage,
  getFeatureImage,
  deleteFeatureImage,
};
