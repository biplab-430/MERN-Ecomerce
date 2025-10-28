import CommonForm from '@/components/common/From'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { addProductFormElements } from '@/config'
import Image from '@/components/admin-view/image-upload'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from '@/store/admin-slice/Product-slice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminProductTile from '@/components/admin-view/product-tile'
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
} from "../../components/ui/alert-dialog";


const initialFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "", // ✅ keep consistent with backend (not discountPrice)
  totalStock: "", // ✅ lowercase `t`
};

function AdminProducts() {
  const [openProduct, setOPenProduct] = useState(false)
  const [formData, setFormdata] = useState(initialFormData)
  const [imageFile, setimageFile] = useState(null)
  const [uploadimageFile, setUploadsetimageFile] = useState('')
  const [loadingimage, setLoadingimage] = useState(false)
  const [CurrentEditedId,setCurrentEditedId] =useState(null)
  const { productList } = useSelector(state => state.adminProducts)
  const dispatch = useDispatch()
  
async function onSubmit(e) {
  e.preventDefault();

  try {
    let result;

    if (CurrentEditedId !== null) {
      // 👉 Editing product
      const editPayload = {
        ...formData,
      };

      // Only include image if a new one is uploaded
      if (uploadimageFile) {
        editPayload.image = uploadimageFile;
      }

      result = await dispatch(
        editProduct({
          id: CurrentEditedId,
          formData: editPayload,
        })
      );

      if (result?.payload?.success) {
        toast.success("✏️ Product updated successfully!", { position: "top-right" });
        dispatch(fetchAllProducts());
        setFormdata(initialFormData);
        setOPenProduct(false);
        setCurrentEditedId(null);
        setimageFile(null);
        setUploadsetimageFile(""); // reset
      } else {
        toast.error(result?.payload?.message || "❌ Failed to update product", { position: "top-right" });
      }
    } else {
      // 👉 Adding new product
      result = await dispatch(
        addNewProduct({
          ...formData,
          image: uploadimageFile, // required when adding
        })
      );

      if (result?.payload?.success) {
        toast.success("✅ Product added successfully!", { position: "top-right" });
        dispatch(fetchAllProducts());
        setFormdata(initialFormData);
        setOPenProduct(false);
        setimageFile(null);
        setUploadsetimageFile(""); // reset
      } else {
        toast.error(result?.payload?.message || "❌ Failed to add product", { position: "top-right" });
      }
    }
  } catch (error) {
    toast.error("⚠️ Something went wrong!", { position: "top-right" });
  }
}

function handleDelete(getCurrProId){
   
    dispatch(deleteProduct(getCurrProId)).then(data=>{
      if(data?.payload?.success){
         dispatch(fetchAllProducts())
      }
})
}

function isFormValid (){
   return Object.keys(formData).map(key=>formData[key] !=='').every((item)=>item)
}



  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOPenProduct(true)}>
          Add new product
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-5'>
        {
  productList && productList.length > 0
    ? productList.map(productItem => (
        <AdminProductTile 
        setFormdata={setFormdata}
        setOPenProduct={setOPenProduct}
        setCurrentEditedId={setCurrentEditedId} 
        key={productItem._id}
         product={productItem} 
        handleDelete={handleDelete}
        />
      ))
    : null
}

      </div>

      <Sheet open={openProduct}
       onOpenChange={() => { setOPenProduct(false)
           setCurrentEditedId(null)
           setFormdata(initialFormData)

        }}>
        <SheetContent side='right' className='overflow-auto'>
          <SheetHeader>
            <SheetTitle>
              {
                CurrentEditedId !==null ?
                   "Edit product ": "Add Product"
              }
            </SheetTitle>
            <SheetDescription>
              Fill in the details below to add a new product to your store.
              Make sure all required fields are complete.
            </SheetDescription>
          </SheetHeader>

          <Image
            imagefile={imageFile}
            setImageFile={setimageFile}
            uploadImageUrl={uploadimageFile}
            setuploadImageUrl={setUploadsetimageFile}
            setLoadingimage={setLoadingimage}
            imageLoading={loadingimage}
            isEditMode={CurrentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormdata}
              buttonText=  {
                CurrentEditedId !==null ?
                   "Edit  ": "Add "
              }
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  )
}

export default AdminProducts
