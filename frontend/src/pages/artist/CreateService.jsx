import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const CreateService = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [serviceType, setServiceType] = useState("commission");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    main_image_url: "",
    gallery_images: [],
    extra_revision_price: 0,
    is_limited: false,
    max_orders_allowed: 0,
    release_date: "",
    is_digital: false,
    product_type: "",
    event_date: "",
    event_time: "",
    total_seats: 0,
    location_details: "",
    tiers: [
      { tier_name: "Basic", price: 100, delivery_days: 7, included_features: [], num_revisions: 1 },
      { tier_name: "Standard", price: 250, delivery_days: 5, included_features: [], num_revisions: 2 },
      { tier_name: "Premium", price: 500, delivery_days: 3, included_features: [], num_revisions: 3 }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------------------- AUTH CHECK -------------------- */

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  /* -------------------- INPUT HANDLERS -------------------- */

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...formData.tiers];
    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      tiers: updated
    }));
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        service_type: serviceType,
        ...formData
      };

      await api.post("/creative-services", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate("/artist/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- HELPERS -------------------- */

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
        return "Commission Service";
      case "prerelease":
        return "Pre-Release Product";
      case "booking":
        return "Bookable Session";
      default:
        return "Service";
    }
  };

  const getServiceTypeDescription = (type) => {
    switch (type) {
      case "commission":
        return "Custom work with tiers and delivery times";
      case "prerelease":
        return "Limited edition drops and exclusive products";
      case "booking":
        return "Workshops, events, and sessions with seats";
      default:
        return "";
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/artist/dashboard")}
            className="mb-6 px-4 py-2 border-2 border-black rounded-lg font-bold hover:bg-black hover:text-white"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold mb-2">Create New Service</h1>
          <p className="text-gray-600">Offer your creative services to customers</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 text-red-600 rounded-lg font-bold">
            {error}
          </div>
        )}

        {/* SERVICE TYPE */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Select Service Type</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {["commission", "prerelease", "booking"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setServiceType(type)}
                className={`p-6 border-2 rounded-lg text-left transition
                ${
                  serviceType === type
                    ? "bg-black text-white border-black"
                    : "border-gray-300 hover:border-black"
                }`}
              >
                <div className="text-4xl mb-3">{getServiceTypeIcon(type)}</div>
                <div className="font-bold text-lg">{getServiceTypeLabel(type)}</div>
                <div className="text-sm opacity-80">
                  {getServiceTypeDescription(type)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* BASIC INFO */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

            <div className="space-y-6">

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Service Title"
                required
                className="w-full px-4 py-3 border-2 border-black rounded-lg"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-black rounded-lg"
              >
                <option value="">Select Category</option>
                <option value="graphic-design">Graphic Design</option>
                <option value="illustration">Illustration</option>
                <option value="photography">Photography</option>
                <option value="digital-art">Digital Art</option>
                <option value="animation">Animation</option>
                <option value="web-design">Web Design</option>
              </select>

              <input
                type="url"
                name="main_image_url"
                value={formData.main_image_url}
                onChange={handleInputChange}
                placeholder="Main Image URL"
                className="w-full px-4 py-3 border-2 border-black rounded-lg"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your service..."
                required
                className="w-full px-4 py-3 border-2 border-black rounded-lg h-32"
              />
            </div>
          </div>

          {/* COMMISSION */}
          {serviceType === "commission" && (
            <div className="bg-gray-50 border-2 rounded-lg p-8 mb-8">

              <label className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  name="is_limited"
                  checked={formData.is_limited}
                  onChange={handleInputChange}
                />
                <span className="font-bold">Limit number of orders</span>
              </label>

              {formData.is_limited && (
                <input
                  type="number"
                  name="max_orders_allowed"
                  value={formData.max_orders_allowed}
                  onChange={handleInputChange}
                  className="w-full mb-4 px-4 py-3 border-2 border-black rounded-lg"
                />
              )}

              <input
                type="number"
                name="extra_revision_price"
                value={formData.extra_revision_price}
                onChange={handleInputChange}
                placeholder="Extra Revision Price"
                className="w-full mb-6 px-4 py-3 border-2 border-black rounded-lg"
              />

              <div className="grid md:grid-cols-3 gap-4">
                {formData.tiers.map((tier, i) => (
                  <div key={i} className="border-2 border-black p-5 rounded-lg bg-white">
                    <h3 className="font-bold mb-3">{tier.tier_name}</h3>

                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) =>
                        handleTierChange(i, "price", Number(e.target.value))
                      }
                      className="w-full mb-2 px-3 py-2 border-2 border-black rounded-lg"
                    />

                    <input
                      type="number"
                      value={tier.delivery_days}
                      onChange={(e) =>
                        handleTierChange(i, "delivery_days", Number(e.target.value))
                      }
                      className="w-full mb-2 px-3 py-2 border-2 border-black rounded-lg"
                    />

                    <input
                      type="number"
                      value={tier.num_revisions}
                      onChange={(e) =>
                        handleTierChange(i, "num_revisions", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border-2 border-black rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRERELEASE */}
          {serviceType === "prerelease" && (
            <div className="bg-gray-50 border-2 p-8 rounded-lg mb-8">

              <input
                type="number"
                name="extra_revision_price"
                value={formData.extra_revision_price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full mb-4 px-4 py-3 border-2 border-black rounded-lg"
              />

              <input
                type="datetime-local"
                name="release_date"
                value={formData.release_date}
                onChange={handleInputChange}
                className="w-full mb-4 px-4 py-3 border-2 border-black rounded-lg"
              />

              <label className="flex gap-2 mb-4">
                <input
                  type="checkbox"
                  name="is_digital"
                  checked={formData.is_digital}
                  onChange={handleInputChange}
                />
                Digital Product
              </label>

              <select
                name="product_type"
                value={formData.product_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-black rounded-lg"
              >
                <option value="">Select Type</option>
                <option value="ebook">E-Book</option>
                <option value="artwork">Artwork</option>
                <option value="music">Music</option>
                <option value="video">Video</option>
                <option value="template">Template</option>
              </select>
            </div>
          )}

          {/* BOOKING */}
          {serviceType === "booking" && (
            <div className="bg-gray-50 border-2 p-8 rounded-lg mb-8">

              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                className="w-full mb-4 px-4 py-3 border-2 border-black rounded-lg"
                required
              />

              <input
                type="time"
                name="event_time"
                value={formData.event_time}
                onChange={handleInputChange}
                className="w-full mb-4 px-4 py-3 border-2 border-black rounded-lg"
                required
              />

              <input
                type="number"
                name="total_seats"
                value={formData.total_seats}
                onChange={handleInputChange}
                placeholder="Total Seats"
                className="w-full mb-4 px-4 py-3 border-2 border-black rounded-lg"
                required
              />

              <textarea
                name="location_details"
                value={formData.location_details}
                onChange={handleInputChange}
                placeholder="Location Details"
                className="w-full px-4 py-3 border-2 border-black rounded-lg"
              />
            </div>
          )}

          {/* BUTTONS */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => navigate("/artist/dashboard")}
              className="border-2 border-black py-3 rounded-lg font-bold hover:bg-black hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-3 rounded-lg font-bold border-2 border-black hover:bg-white hover:text-black"
            >
              {loading ? "Creating..." : "Create Service"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateService;
