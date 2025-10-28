import React from 'react'
import { Button } from '../ui/button'
import { FaBars } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from 'react-redux';
import { logOutUser, resetTokenCredentials } from '@/store/auth-slice';
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
} from '../ui/alert-dialog'
import { useNavigate } from 'react-router-dom';


function AdminHeader({ setOpen }) {
  const dispatch = useDispatch()
    const navigate = useNavigate()

  const handleLogOut = () => {
  dispatch(resetTokenCredentials())
     sessionStorage.clear()
     navigate('/auth/login')
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b w-full">
      {/* Left side: mobile menu toggle */}
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <FaBars size={24} />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Right side: logout button with confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow">
            <AiOutlineLogout />
            Logout
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className='font-bold'>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription  className='font-bold'>
              Are you sure you want to log out 🥹? You will need to log in again to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='text-white hover:text-green-400'>Cancel</AlertDialogCancel>
            <AlertDialogAction className='text-white hover:text-red-400' onClick={handleLogOut}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}

export default AdminHeader
