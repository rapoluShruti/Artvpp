import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const BrowseServices = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ---------------------------
  // FETCH SERVICES
  // ---------------------------
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/creative-services");
      setServices(res.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // FILTER
  // ---------------------------
  const filteredServices = services.filter((service) =>
    service.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------------------------
  // HELPERS
  // ---------------------------
  const getServiceTypeIcon = (type) => {
    switch (type) {
      case "commission":
        return "🎨";
      case "prerelease":
        return "🚀";
      case "booking":
        return "📅";
      default:
        return "⭐";
    }
  };

  const getServiceTypeLabel = (type) => {
    switch (type) {
      case "commission":
        return "Commission";
      case "prerelease":
        return "Pre-Release";
      case "booking":
        return "Booking";
      default:
        return "Service";
    }
  };

  // ---------------------------
  // LOADING
  // ---------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-black text-sm">Loading services...</p>
        </div>
      </div>
    );
  }

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-2">
            Creative Services
          </h1>
          <p className="text-gray-600">
            Discover unique services from talented artists
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* GRID */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No services found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(`/services/${service.id}`)}
                className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition cursor-pointer"
              >
                {/* IMAGE */}
                <div className="h-56 bg-gray-100 flex items-center justify-center text-4xl">
                  {service.main_image_url ? (
                    <img
                      src={service.main_image_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getServiceTypeIcon(service.service_type)
                  )}
                </div>

                {/* INFO */}
                <div className="p-5">
                  <div className="inline-block px-3 py-1 bg-black text-white rounded-full text-xs font-bold mb-3">
                    {getServiceTypeIcon(service.service_type)}{" "}
                    {getServiceTypeLabel(service.service_type)}
                  </div>

                  <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
                    {service.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {service.category && (
                    <div className="mb-3 text-xs text-gray-500">
                      📁 {service.category}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    {service.base_price ? (
                      <div className="text-lg font-bold text-black">
                        ₹{Number(service.base_price).toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        Custom Pricing
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseServices;
