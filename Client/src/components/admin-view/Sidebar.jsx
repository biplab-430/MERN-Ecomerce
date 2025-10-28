import { adminSidebarMenuItems } from '@/config';
import React, { Fragment } from 'react';
import { MdAdminPanelSettings } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle,SheetDescription } from '../ui/sheet';

function MenuItem({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname.startsWith(menuItem.path);
        const Icon = menuItem.icon;

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer transition-colors
              ${isActive ? 'bg-primary text-white' : 'hover:bg-muted'}
            `}
          >
            <Icon size={20} />
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex items-center gap-2 mt-5 mb-4">
                <MdAdminPanelSettings size={30} />
                <SheetDescription className="sr-only">
                Sidebar navigation for admin panel
              </SheetDescription>
              </SheetTitle>
            </SheetHeader>
            <MenuItem setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center cursor-pointer gap-2"
        >
          <MdAdminPanelSettings size={30} />
          <h2 className="text-xl font-extrabold">Admin Panel</h2>
        </div>

        <MenuItem setOpen={setOpen} />
      </aside>
    </Fragment>
  );
}

export default AdminSidebar;
