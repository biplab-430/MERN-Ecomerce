import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { HelpCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingViewHeaderMenuItems } from '@/config'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { logOutUser } from '@/store/auth-slice'
import UserCartwrapper from './Cart-wrapper'
import { getCartItems } from '@/store/Cart-slice'
import { Label } from '../ui/label'

// Menu links
function MenuItems() {
  const navigate=useNavigate()
  const location=useLocation()
  const [searchParams,setsearchParams]=useSearchParams()

  // it also not working
 function handleNavigateListingpage(getCurrentIMenutem){
       sessionStorage.removeItem('filters');
       const currentFilter=getCurrentIMenutem.id !=='home'  && getCurrentIMenutem.id !== 'products'   && getCurrentIMenutem.id !== 'search'?
       {
         category:[getCurrentIMenutem.id]
       }:null

       sessionStorage.setItem('filters', JSON.stringify(currentFilter));
       location.pathname.includes('list') && currentFilter !==null?
       setsearchParams(new URLSearchParams(`?category=${getCurrentIMenutem.id}`)):
       navigate(getCurrentIMenutem.path)
 }
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((item) => (
        <Label
        onClick={()=>{handleNavigateListingpage(item)}}
          key={item.id}
          to={item.path}
          className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
        >
          {item.label}
        </Label>
      ))}
    </nav>
  )
}

// Right side: Cart + User Dropdown
function HeaderRightContent() {
  const [openCartSheet, setOpenCartSheet] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.shopCart)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  
  const handleLogout = () => {
    dispatch(logOutUser())
    navigate('/auth/login')
  }


  useEffect(() => {
    if (user?.id) {
      dispatch(getCartItems(user?.id))
    }
  }, [dispatch])

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
    
    <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
  <Button
    onClick={() => setOpenCartSheet(true)}
    variant="outline"
    size="icon"
    className="relative  hover:bg-amber-950"
  >
    <ShoppingCart className="w-6 h-6 text-blue-400 " />

    {/* Badge for cart items */}
    {cartItems?.items?.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {cartItems.items.length}
      </span>
    )}

    <span className="sr-only">User cart</span>
  </Button>

  <UserCartwrapper
    setOpenCartSheet={setOpenCartSheet}
    cartItems={cartItems?.items || []}
  />
</Sheet>





      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold hover:bg-amber-950">
              {user?.userName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" className="w-56">
          <DropdownMenuLabel>
            Logged in as{' '}
            <span className="font-semibold">
              {user?.userName?.toUpperCase() || 'User'}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/shop/account')}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
             <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/shop/help')}>
            <HelpCircle className="mr-2 h-4 w-4 font-extrabold" />
         Help
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Full header with mobile & desktop menus
function Header() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">B-Mart</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Choose a category from the menu
              </SheetDescription>
            </SheetHeader>
            <MenuItems />
            {isAuthenticated && (
              <div className="mt-4 border-t pt-4">
                <HeaderRightContent />
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <MenuItems />
          {isAuthenticated && <HeaderRightContent />}
        </div>
      </div>
    </header>
  )
}

export default Header
