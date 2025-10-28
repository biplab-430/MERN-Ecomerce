import React, { useEffect, useState } from "react";
import Image from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/admin-slice/DashBoard-Slice";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

function Dashboards() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadImageUrl, setUploadImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // ✅ store image id to delete

  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  // ✅ Upload image
  const handleUploadFeatureImage = async () => {
    if (!uploadImageUrl) {
      toast.warning("Please upload an image first.");
      return;
    }

    setLoadingImage(true);
    try {
      const result = await dispatch(addFeatureImage(uploadImageUrl));
      if (result?.payload?.success) {
        toast.success("Image uploaded successfully!");
        await dispatch(getFeatureImages());
        setImageFile(null);
        setUploadImageUrl("");
      } else {
        toast.error(result?.payload?.message || "Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Something went wrong while uploading.");
    } finally {
      setLoadingImage(false);
    }
  };

  // ✅ Delete image instantly (no reload)
  const handleDeleteImage = async () => {
    if (!deleteId) return;
    try {
      const result = await dispatch(deleteFeatureImage(deleteId));
      if (result?.payload?.success) {
        toast.success("Image deleted successfully!");
        dispatch({
          type: "commonFeature/removeFeatureImage",
          payload: deleteId,
        });
      } else {
        toast.error(result?.payload?.message || "Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Something went wrong while deleting.");
    } finally {
      setDeleteId(null); // close dialog
    }
  };

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="p-4">
      {/* Upload Section */}
      <Image
        imagefile={imageFile}
        setImageFile={setImageFile}
        uploadImageUrl={uploadImageUrl}
        setuploadImageUrl={setUploadImageUrl}
        setLoadingimage={setLoadingImage}
        imageLoading={loadingImage}
        isCustomStyling={true}
      />

      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={loadingImage}
      >
        {loadingImage ? "Uploading..." : "Upload"}
      </Button>

      {/* Display Section */}
      <div className="flex flex-col gap-6 mt-8">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImageItem, index) => (
            <div
              key={featureImageItem._id || index}
              className="relative w-full h-screen overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={featureImageItem?.image}
                alt={featureImageItem?.title || "Feature Image"}
                className="w-full object-cover"
              />

              {/* Delete Button with Alert Dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={() => setDeleteId(featureImageItem._id)}
                    className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition"
                    title="Delete Image"
                  >
                    <Trash2 size={20} />
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this image?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The image will be
                      permanently removed from the feature list.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteId(null)} className="text-amber-100 hover:text-green-600 bg-red-500 hover:bg-red-900">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteImage}
                      className="bg-red-600 hover:bg-red-700 hover:text-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No feature images found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboards;
