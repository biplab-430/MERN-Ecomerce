import React from 'react';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side */}
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
        <div className="max-w-md space-y-6 text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to E-commerce
          </h1>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex  lg:w-1/2 w-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
