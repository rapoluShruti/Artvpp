import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BrowseServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const servicesRes = await axios.get('http://localhost:5000/api/creative-services');
      setServices(servicesRes.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    if (searchTerm && !service.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

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
      case 'commission': return 'Commission';
      case 'prerelease': return 'Pre-Release';
      case 'booking': return 'Booking';
      default: return 'Service';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12  border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-black text-sm">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-2">Creative Services</h1>
          <p className="text-gray-600">Discover unique services from talented artists</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Services Grid */}
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
                className="bg-white  rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                {/* Service Image */}
                <div className="h-56 bg-gray-100 flex items-center justify-center  text-4xl">
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

                {/* Service Info */}
                <div className="p-5">
                  {/* Type Badge */}
                  <div className="inline-block px-3 py-1 bg-black text-white rounded-full text-xs font-bold mb-3">
                    {getServiceTypeIcon(service.service_type)} {getServiceTypeLabel(service.service_type)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">{service.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                  {/* Category */}
                  {service.category && (
                    <div className="mb-3 text-xs text-gray-500">
                      📁 {service.category}
                    </div>
                  )}

                  {/* Price or Status */}
                  <div className="border-t-2 border-gray-200 pt-4">
                    {service.base_price ? (
                      <div className="text-lg font-bold text-black">
                        ₹{parseFloat(service.base_price).toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">Custom Pricing</div>
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
