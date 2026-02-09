import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserFromToken } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Check user from token
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      if (token) setUser(getUserFromToken());
      else setUser(null);
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser(getUserFromToken());
    else setUser(null);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Reusable button styles
  const navBtn =
    "text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md font-medium transition";

  const dropdownBtn =
    "block w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 font-medium";

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="/logo.jpeg"
            alt="ArtVPP Logo"
            className="h-10 object-contain"
          />
          <span className="text-xl font-bold text-gray-900">
            ArtVPP
          </span>
        </div>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center space-x-2">

          <button onClick={() => navigate("/browse")} className={navBtn}>
            Shop
          </button>

          <button onClick={() => navigate("/services")} className={navBtn}>
            Services
          </button>

          {/* CUSTOMER */}
          {user?.role === "customer" && (
            <>
            <button onClick={() => navigate("/digital-products")} className={navBtn}>
               Downloads
              </button>
            <button onClick={() => navigate("/cart")} className={navBtn}>
                Cart
              </button>
              <button onClick={() => navigate("/orders")} className={navBtn}>
                Orders
              </button>

              

              <button
                onClick={() => navigate("/dashboard/customer")}
                className={navBtn}
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/artist/become")}
                className={navBtn}
              >
                Become Artist
              </button>
            </>
          )}

          {/* ARTIST */}
          {user?.role === "artist" && (
            <>
              <button
                onClick={() => navigate("/artist/create-product")}
                className={navBtn}
              >
                Create Product
              </button>

              <button
                onClick={() => navigate("/artist/create-service")}
                className={navBtn}
              >
                Create Service
              </button>

              <button
                onClick={() => navigate("/order-management")}
                className={navBtn}
              >
                Orders
              </button>

              <button
                onClick={() => navigate("/artist/booking-management")}
                className={navBtn}
              >
                Bookings
              </button>

              <button
                onClick={() => navigate("/dashboard/artist")}
                className={navBtn}
              >
                Dashboard
              </button>
            </>
          )}

          {/* ADMIN */}
          {user?.role === "admin" && (
            <>
              <button onClick={() => navigate("/admin/approvals")} className={navBtn}>
                Approvals
              </button>
            </>
          )}

        </div>

        {/* USER AREA */}
        <div className="relative">

          {user ? (
            <>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 border px-3 py-2 rounded-md hover:border-blue-500 transition"
              >
                <span className="text-sm max-w-[140px] truncate">
                  {user.email}
                </span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {user.role}
                </span>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-lg">

                  {user.role === "customer" && (
                    <button
                      onClick={() => handleNavigation("/dashboard/customer")}
                      className={dropdownBtn}
                    >
                      My Dashboard
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-medium"
                  >
                    Logout
                  </button>

                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
