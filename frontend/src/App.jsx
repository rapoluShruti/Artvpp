import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import HeroSection from "./components/HeroSection";
import ProductBrowse from "./pages/ProductBrowse";
import ProductDetail from "./pages/ProductDetail";
import ArtistProfile from "./pages/ArtistProfile";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import ArtistDashboard from "./pages/artist/ArtistDashboard";
import ArtistProductDashboard from "./pages/artist/Dashboard";
import CustomerDashboard from "./pages/customer/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import BrowseServices from "./pages/BrowseServices";
import ServiceDetail from "./pages/ServiceDetail";
import CreateService from "./pages/artist/CreateService";
import ManageServices from "./pages/artist/ManageServices";
import ServiceOrders from "./pages/artist/ServiceOrders";
import BookingManagement from "./pages/artist/BookingManagement";
import CustomerServiceOrders from "./pages/customer/CustomerServiceOrders";
import CustomerBookings from "./pages/customer/CustomerBookings";
import ManageProducts from "./pages/artist/ManageProducts";
import BecomeArtist from "./pages/BecomeArtist";
import ArtistOnboarding from "./pages/artist/ArtistOnboarding";
import OrderManagement from "./pages/artist/OrderManagement";
import DigitalProducts from "./pages/DigitalProducts";
import ShopExplore from "./pages/ShopExplore";
import ArtistApprovals from "./pages/admin/ArtistApprovals";

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Browse & Shop */}
        <Route path="/browse" element={<ProductBrowse />} />
        <Route path="/explore" element={<ShopExplore />} />
        <Route path="/services" element={<BrowseServices />} />
        <Route path="/service/:service_id" element={<ServiceDetail />} />
        <Route path="/services/:service_id" element={<ServiceDetail />} />
        <Route path="/dashboard/artist" element={<ArtistDashboard />} />
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
            <Route path="/admin/approvals" element={<ArtistApprovals />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/artist/dashboard" element={<ArtistDashboard />} />
        <Route path="/artist/create-product" element={<ArtistProductDashboard />} />
        <Route path="/artist/create-service" element={<CreateService />} />
        <Route path="/artist/edit-service/:serviceId" element={<CreateService />} />
        <Route path="/artist/manage-services" element={<ManageServices />} />
        <Route path="/artist/manage-products" element={<ManageProducts />} />
        <Route path="/artist/become" element={<BecomeArtist />} />
        <Route path="/artist/onboarding" element={<ArtistOnboarding />} />
        <Route path="/artist/service-orders" element={<ServiceOrders />} />
        <Route path="/artist/booking-management" element={<BookingManagement />} />
        <Route path="/customer/orders" element={<CustomerServiceOrders />} />
        <Route path="/customer/bookings" element={<CustomerBookings />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/artist/:artistId" element={<ArtistProfile />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout/:orderId" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
         <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/digital-products" element={<DigitalProducts />} />
        <Route path="/orders" element={<OrderTracking />} />
      </Routes>
    </Layout>
  );
}
