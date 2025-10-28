// App.jsx
import { Route, Routes } from "react-router-dom";
import Layout from "./components/auth/Layout";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import "./App.css";
import AdminLayout from "./components/admin-view/Admin-layout";
import AdminDashboards from "./Pages/admin-view/Dashboards";
import AdminUsers from "./Pages/admin-view/Features";
import AdminOrders from "./Pages/admin-view/Orders";
import AdminProducts from "./Pages/admin-view/Products";
import ShoopingLayout from "./components/shooping-view/ShoopingLayout";
import NotFound from "./Pages/Not-found/Index";
import Home from "./Pages/shooping-view/Home";
import Listing from "./Pages/shooping-view/Listing";
import Checkout from "./Pages/shooping-view/Checkout";
import Account from "./Pages/shooping-view/Account";
import CheckAuth from "./components/common/CheckAuth";
import Index from "./Pages/UnAuth-page/Index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import HelpUser from "./Pages/shooping-view/HelpUser";
import PaypalReturn from "./Pages/shooping-view/paypal-return";
import PaymentSuccess from "./Pages/shooping-view/payment-success";
import SearchProducts from "./Pages/shooping-view/Search";
import AdminContact from "./Pages/admin-view/Contact";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    const token=JSON.parse(sessionStorage.getItem("token"))
    dispatch(checkAuth(token));
  }, [dispatch]);

  if (isLoading) return <Skeleton className="h-[600px] w-[600px] rounded-full" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* ✅ Default route redirects to appropriate section */}
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              {user?.role === "admin" ? (
                <AdminDashboards />
              ) : isAuthenticated ? (
               <Home />
              ) : (
                <Index />
              )}
            </CheckAuth>
          }
        />

        {/* ✅ Auth Routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Layout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* ✅ Admin Routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboards />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="contact" element={<AdminContact/>} />
        </Route>

        {/* ✅ Shopping Routes */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoopingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="list" element={<Listing />} />
          <Route path="check" element={<Checkout />} />
          <Route path="account" element={<Account />} />
          <Route path="paypal-return" element={<PaypalReturn />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="help" element={<HelpUser />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        {/* ✅ Unauth & Not Found Pages */}
        <Route path="/unAuthPage" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
