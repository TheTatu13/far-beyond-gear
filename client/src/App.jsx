import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { trackPageView } from "./lib/analytics.js";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Categories from "./pages/Categories.jsx";
import Brands from "./pages/Brands.jsx";
import BrandDetails from "./pages/BrandDetails.jsx";
import ArtistDetails from "./pages/ArtistDetails.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Cookies from "./pages/Cookies.jsx";
import Withdrawal from "./pages/Withdrawal.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Careers from "./pages/Careers.jsx";
import Blog from "./pages/Blog.jsx";
import Faq from "./pages/Faq.jsx";
import GuitarGuide from "./pages/GuitarGuide.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./utils/ScrollToTop.jsx";

function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <PageTracker />
      <ToastContainer theme="dark" position="bottom-right" />
      <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/brands/:id" element={<BrandDetails />} />
        <Route path="/artist/:id" element={<ArtistDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/guitar-guide" element={<GuitarGuide />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Layout>
    </>
  );
}
