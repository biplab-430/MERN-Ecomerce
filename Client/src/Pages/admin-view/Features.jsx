import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUserById, editUserById } from "../../store/AdminUser-Slice/index";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
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
} from "../../components/ui/alert-dialog";
import { Input } from "../../components/ui/input";
import { toast } from "react-toastify";


function AdminUsers() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.AdminUser);

  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteUserById(id));
    toast.success("User deleted successfully ✅");
    dispatch(getAllUsers());
  };

  const handleEdit = async (id) => {
    await dispatch(editUserById({ id, updatedData: editData }));
    toast.success("User updated successfully ✨");
    setEditMode(null);
    dispatch(getAllUsers());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-200 p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-900 drop-shadow-md">
        Manage Users
      </h2>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading users...</p>
      ) : users?.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users.map((user) => (
            <Card
              key={user._id}
              className="bg-white/80 backdrop-blur-sm border border-indigo-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 rounded-2xl"
            >
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-t-2xl">
                <CardTitle className="text-lg font-semibold text-white tracking-wide">
                  {user.username}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 mt-3">
                {editMode === user._id ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="Username"
                      value={editData.username}
                      onChange={(e) =>
                        setEditData({ ...editData, username: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Password"
                      type="password"
                      value={editData.password}
                      onChange={(e) =>
                        setEditData({ ...editData, password: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <>
                 
                    <p className="text-sm text-gray-700">
                      <strong className="text-indigo-600">Email:</strong>{" "}
                      {user.email}
                    </p>
                
                    {/* <p className="text-sm text-gray-700">
                      <strong className="text-indigo-600">Password:</strong>{" "}
                      {user.password}
                    </p> */}
                  </>
                )}
              </CardContent>

              <CardFooter className="flex justify-between mt-2">
                {editMode === user._id ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleEdit(user._id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => {
                        setEditMode(user._id);
                        setEditData({
                          username: user.username,
                          email: user.email,
                          password: user.password,
                        });
                      }}
                    >
                      Update
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600">
                            Delete User
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this user? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-amber-100 hover:text-green-600 bg-red-500 hover:bg-red-900">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(user._id)}
                           className="bg-red-600 hover:bg-red-700 hover:text-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
