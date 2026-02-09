import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";

export default function ShopExplore() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("shop");
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (activeTab === "shop") {
      loadProducts();
      loadCategories();
    } else {
      loadServices();
    }
  }, [activeTab]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filterCategory) params.append("category", filterCategory);
      
      const res = await api.get(`/customer/products?${params}`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/creative-services");
      let servicesData = res.data || [];
      
      if (searchTerm) {
        servicesData = servicesData.filter(s =>
          s.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setServices(servicesData);
    } catch (err) {
      console.error("Error loading services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (activeTab === "shop") {
      loadProducts();
    } else {
      loadServices();
    }
  }, [searchTerm, filterCategory]);

  const getServiceTypeIcon = (type) => {
    switch (type) {
      case "commission": return "🎨";
      case "prerelease": return "🚀";
      case "booking": return "📅";
      default: return "⭐";
    }
  };

  const getServiceTypeLabel = (type) => {
    switch (type) {
      case "commission": return "Commission";
      case "prerelease": return "Pre-Release";
      case "booking": return "Booking";
      default: return "Service";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore</h1>
          <p className="text-gray-600 text-lg">Discover amazing products and services</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 mb-8 bg-white rounded-xl border-2 border-gray-300 p-1 shadow-md w-fit">
          <button
            onClick={() => setActiveTab("shop")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "shop"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            🛒 Shop
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "services"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            ✨ Services
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder={activeTab === "shop" ? "Search products..." : "Search services..."}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
          />
        </div>

        {/* Filters for Shop */}
        {activeTab === "shop" && categories.length > 0 && (
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterCategory("")}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                filterCategory === ""
                  ? "bg-blue-600 text-white"
                  : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.name}
                onClick={() => setFilterCategory(cat.name)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  filterCategory === cat.name
                    ? "bg-blue-600 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Shop Tab - Products Grid */}
        {activeTab === "shop" && !loading && (
          <div>
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-300">
                <p className="text-gray-600 text-lg font-medium">No products found</p>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="bg-white rounded-xl border-2 border-gray-300 shadow-md hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">🎨</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-lg truncate mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{product.price}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                          {product.category}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Tab - Services Grid */}
        {activeTab === "services" && !loading && (
          <div>
            {services.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-300">
                <p className="text-gray-600 text-lg font-medium">No services found</p>
                <p className="text-gray-500">Try adjusting your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="bg-white rounded-xl border-2 border-gray-300 shadow-md hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b-2 border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg flex-1">
                          {service.title}
                        </h3>
                        <span className="text-2xl ml-2">
                          {getServiceTypeIcon(service.service_type)}
                        </span>
                      </div>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-semibold inline-block">
                        {getServiceTypeLabel(service.service_type)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {service.description}
                      </p>

                      {/* Service Details */}
                      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                        {service.price && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Starting at</span>
                            <span className="text-xl font-bold text-blue-600">
                              ₹{service.price}
                            </span>
                          </div>
                        )}
                        {service.turnaround_days && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Turnaround</span>
                            <span className="font-semibold text-gray-700">
                              {service.turnaround_days} days
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Artist Info */}
                      {service.artist_name && (
                        <div className="mb-4 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
                            {service.artist_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {service.artist_name}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/service/${service.id}`);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                      >
                        View Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
