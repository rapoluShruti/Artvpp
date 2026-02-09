import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateService = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState('commission');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    main_image_url: '',
    gallery_images: [],
    extra_revision_price: 0,
    is_limited: false,
    max_orders_allowed: 0,
    release_date: '',
    is_digital: false,
    product_type: '',
    event_date: '',
    event_time: '',
    total_seats: 0,
    location_details: '',
    tiers: [
      { tier_name: 'Basic', price: 100, delivery_days: 7, included_features: [], num_revisions: 1 },
      { tier_name: 'Standard', price: 250, delivery_days: 5, included_features: [], num_revisions: 2 },
      { tier_name: 'Premium', price: 500, delivery_days: 3, included_features: [], num_revisions: 3 }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...formData.tiers];
    newTiers[index][field] = value;
    setFormData(prev => ({
      ...prev,
      tiers: newTiers
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        service_type: serviceType,
        ...formData
      };

      await axios.post('http://localhost:5000/api/creative-services', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/artist/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  const getServiceTypeIcon = (type) => {
    switch(type) {
      case 'commission': return '🎨';
      case 'prerelease': return '🚀';
      case 'booking': return '📅';
      default: return '⭐';
    }
  };

  const getServiceTypeLabel = (type) => {
    switch(type) {
      case 'commission': return 'Commission Service';
      case 'prerelease': return 'Pre-Release Product';
      case 'booking': return 'Bookable Session';
      default: return 'Service';
    }
  };

  const getServiceTypeDescription = (type) => {
    switch(type) {
      case 'commission': return 'Custom work with tiers and delivery times';
      case 'prerelease': return 'Limited edition drops and exclusive products';
      case 'booking': return 'Workshops, events, and sessions with seats';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/artist/dashboard')}
            className="mb-6 px-4 py-2 border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-black mb-2">Create New Service</h1>
          <p className="text-gray-600">Offer your creative services to customers</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 font-bold">
            {error}
          </div>
        )}

        {/* Service Type Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Select Service Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['commission', 'prerelease', 'booking'].map(type => (
              <button
                key={type}
                onClick={() => setServiceType(type)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  serviceType === type
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-black hover:border-black'
                }`}
              >
                <div className={`text-4xl mb-3 ${serviceType === type ? '' : ''}`}>
                  {getServiceTypeIcon(type)}
                </div>
                <div className="font-bold text-lg mb-1">{getServiceTypeLabel(type)}</div>
                <div className={`text-sm ${serviceType === type ? 'text-gray-200' : 'text-gray-600'}`}>
                  {getServiceTypeDescription(type)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block font-bold text-black mb-2">Service Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Professional Logo Design"
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-black mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  >
                    <option value="">Select Category</option>
                    <option value="graphic-design">Graphic Design</option>
                    <option value="illustration">Illustration</option>
                    <option value="photography">Photography</option>
                    <option value="digital-art">Digital Art</option>
                    <option value="animation">Animation</option>
                    <option value="web-design">Web Design</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-black mb-2">Main Image URL</label>
                  <input
                    type="url"
                    name="main_image_url"
                    value={formData.main_image_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-black mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your service, what customers will get, and any requirements..."
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500 h-32"
                  required
                />
              </div>
            </div>
          </div>

          {/* Commission Service */}
          {serviceType === 'commission' && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-black mb-6">Commission Tiers & Settings</h2>

              <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    name="is_limited"
                    checked={formData.is_limited}
                    onChange={handleInputChange}
                    className="w-5 h-5 border-2 border-black rounded cursor-pointer"
                  />
                  <span className="font-bold text-black">Limit the number of orders</span>
                </label>

                {formData.is_limited && (
                  <div>
                    <label className="block font-bold text-black mb-2">Maximum Orders Allowed</label>
                    <input
                      type="number"
                      name="max_orders_allowed"
                      value={formData.max_orders_allowed}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full md:w-48 px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    />
                  </div>
                )}
              </div>

              <div className="mb-8">
                <label className="block font-bold text-black mb-2">Extra Revision Price ($)</label>
                <input
                  type="number"
                  name="extra_revision_price"
                  value={formData.extra_revision_price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full md:w-48 px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-black mb-4">Pricing Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.tiers.map((tier, idx) => (
                    <div key={idx} className="border-2 border-black rounded-lg p-6 bg-white">
                      <div className="font-bold text-lg text-black mb-4">{tier.tier_name}</div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-600 mb-1">Price ($)</label>
                          <input
                            type="number"
                            value={tier.price}
                            onChange={(e) => handleTierChange(idx, 'price', parseFloat(e.target.value))}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-600 mb-1">Delivery Days</label>
                          <input
                            type="number"
                            value={tier.delivery_days}
                            onChange={(e) => handleTierChange(idx, 'delivery_days', parseInt(e.target.value))}
                            min="1"
                            className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-600 mb-1">Revisions</label>
                          <input
                            type="number"
                            value={tier.num_revisions}
                            onChange={(e) => handleTierChange(idx, 'num_revisions', parseInt(e.target.value))}
                            min="0"
                            className="w-full px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pre-Release Service */}
          {serviceType === 'prerelease' && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-black mb-6">Pre-Release Settings</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-black mb-2">Price ($)</label>
                    <input
                      type="number"
                      name="extra_revision_price"
                      value={formData.extra_revision_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-black mb-2">Release Date</label>
                    <input
                      type="datetime-local"
                      name="release_date"
                      value={formData.release_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_digital"
                        checked={formData.is_digital}
                        onChange={handleInputChange}
                        className="w-5 h-5 border-2 border-black rounded cursor-pointer"
                      />
                      <span className="font-bold text-black">Digital Product</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-black mb-2">Product Type</label>
                    <select
                      name="product_type"
                      value={formData.product_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    >
                      <option value="">Select Type</option>
                      <option value="ebook">E-Book</option>
                      <option value="artwork">Artwork</option>
                      <option value="music">Music</option>
                      <option value="video">Video</option>
                      <option value="template">Template</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Service */}
          {serviceType === 'booking' && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-black mb-6">Booking Settings</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-black mb-2">Event Date *</label>
                    <input
                      type="date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-black mb-2">Event Time *</label>
                    <input
                      type="time"
                      name="event_time"
                      value={formData.event_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-black mb-2">Total Seats *</label>
                  <input
                    type="number"
                    name="total_seats"
                    value={formData.total_seats}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full md:w-48 px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-black mb-2">Location Details</label>
                  <textarea
                    name="location_details"
                    value={formData.location_details}
                    onChange={handleInputChange}
                    placeholder="Full address, venue details, parking info, etc."
                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500 h-24"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <button
              type="button"
              onClick={() => navigate('/artist/dashboard')}
              className="px-6 py-3 border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 font-bold rounded-lg text-lg transition-all ${
                loading
                  ? 'bg-gray-400 text-gray-600 border-2 border-gray-400 cursor-not-allowed'
                  : 'bg-black text-white border-2 border-black hover:bg-white hover:text-black'
              }`}
            >
              {loading ? 'Creating...' : '✓ Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;
