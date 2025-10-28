import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './Sidebar'
import AdminHeader from './Header'

function AdminLayout() {
const [open,setOpen]=useState(false)

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar (hidden on small screens, visible on lg+) */}
      <AdminSidebar open={open} setOpen={setOpen} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Sticky header */}
        <header className="sticky top-0 z-10 w-full border-b bg-background">
          <AdminHeader setOpen={setOpen}/>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 flex-col bg-muted/40 p-4 md:p-5 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
