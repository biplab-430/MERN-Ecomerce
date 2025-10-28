import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { FileIcon, UploadCloudIcon, XIcon, Loader2 } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ✅ use env variable

function Image({
  imagefile,
  setImageFile,
  uploadImageUrl,
  setuploadImageUrl,
  setLoadingimage,
  imageLoading,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  // Handle file selection
  const handleImageFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      setuploadImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Drag & Drop
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setImageFile(droppedFile);
      setuploadImageUrl(URL.createObjectURL(droppedFile));
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setuploadImageUrl("");
    if (inputRef.current) inputRef.current.value = "";
  };

  // Upload to Cloudinary / backend
  const uploadToCloudinary = async () => {
    if (!imagefile) return;
    setLoadingimage(true);
    try {
      const formData = new FormData();
      formData.append("my-file", imagefile);

      const res = await axios.post(
        `${API_URL}/api/admin/products/upload-image`,
        formData
      );

      if (res?.data?.success) {
        setuploadImageUrl(res.data.result.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoadingimage(false);
    }
  };

  useEffect(() => {
    if (imagefile) uploadToCloudinary();
  }, [imagefile]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Input
        id="image-upload"
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        disabled={isEditMode}
      />

      <Label
        htmlFor="image-upload"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center relative ${
          isEditMode
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer hover:border-primary"
        }`}
      >
        {/* Loading spinner */}
        {imageLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        )}

        {/* Upload prompt or preview */}
        {uploadImageUrl ? (
          <div className="w-full flex flex-col items-center">
            <img
              src={uploadImageUrl}
              alt="Preview"
              className="max-h-48 rounded-lg object-contain mb-2"
            />

            {imagefile && (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <FileIcon className="w-6 h-6 text-primary mr-2" />
                  <p className="text-sm font-medium truncate">{imagefile.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleRemoveImage}
                  disabled={imageLoading}
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Remove File</span>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & Drop or click to upload image</span>
          </div>
        )}
      </Label>
    </div>
  );
}

export default Image;
