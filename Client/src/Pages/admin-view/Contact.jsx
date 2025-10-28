import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts, deleteContactById } from "@/store/Contact-Slice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminContact() {
  const dispatch = useDispatch();
  const { contacts } = useSelector((state) => state.Contact);

  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteContactById(id)).unwrap();
      toast.success("Contact deleted successfully ✅", {
        position: "top-right",
        autoClose: 2000,
      });
      dispatch(getAllContacts());
    } catch (error) {
      toast.error("Failed to delete contact ❌", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-900 drop-shadow-md">
        All Contacts
      </h2>

      {contacts?.length === 0 ? (
        <p className="text-center text-blue-700 font-medium">
          No contact messages found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {contacts.map((contact) => (
            <Card
              key={contact._id}
              className="bg-white/80 backdrop-blur-sm border border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 rounded-2xl"
            >
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl">
                <CardTitle className="text-lg font-semibold text-white tracking-wide">
                  {contact.username}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 mt-3">
                <p className="text-sm text-gray-700">
                  <strong className="text-blue-600">Email:</strong>{" "}
                  {contact.email}
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-blue-600">Message:</strong>{" "}
                  {contact.message}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white shadow-md"
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-600">
                        Delete Contact
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this contact message?{" "}
                        <br /> This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-amber-100 hover:text-green-600 bg-red-500 hover:bg-red-900">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(contact._id)}
                        className="bg-red-600 hover:bg-red-700 hover:text-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminContact;
