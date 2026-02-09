import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // ✅ USE CENTRAL API

const ManageServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedService, setExpandedService] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchServices();
  }, [token, navigate]);

  const fetchServices = async () => {
    try {
      const profileRes = await api.get("/artist-profile/me");

      const servicesRes = await api.get(
        `/creative-services/artist/${profileRes.data.id}`
      );

      setServices(servicesRes.data || []);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (serviceId, newStatus) => {
    try {
      await api.put(`/creative-services/${serviceId}`, {
        status: newStatus,
      });
      fetchServices();
    } catch (err) {
      console.error("Error updating service:", err);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await api.delete(`/creative-services/${serviceId}`);
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

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

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold text-black">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">
              Manage Services
            </h1>
            <p className="text-gray-600">
              Edit, activate, or delete your creative services
            </p>
          </div>
          <button
            onClick={() => navigate("/artist/create-service")}
            className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
          >
            + New Service
          </button>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 border-2 border-gray-300 rounded-lg bg-gray-50">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 font-bold mb-6">
              No services yet
            </p>
            <button
              onClick={() => navigate("/artist/create-service")}
              className="px-6 py-3 bg-black text-white font-bold rounded-lg"
            >
              Create Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-black transition-all cursor-pointer"
                onClick={() =>
                  setExpandedService(
                    expandedService === service.id ? null : service.id
                  )
                }
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getServiceTypeIcon(service.service_type)}
                    </span>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                  </div>
                  <span className="px-4 py-2 bg-black text-white rounded-lg font-bold text-sm">
                    {service.service_type}
                  </span>
                </div>

                {expandedService === service.id && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/artist/edit-service/${service.id}`);
                      }}
                      className="px-4 py-2 bg-black text-white rounded-lg"
                    >
                      ✎ Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(
                          service.id,
                          service.status === "active"
                            ? "inactive"
                            : "active"
                        );
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      {service.status === "active" ? "⏸ Pause" : "✓ Activate"}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(service.id);
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg"
                    >
                      🗑 Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices;
