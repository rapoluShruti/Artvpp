import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedService, setExpandedService] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchServices();
  }, [token, navigate]);

  const fetchServices = async () => {
    try {
      const profileRes = await axios.get('http://localhost:5000/api/artist-profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const servicesRes = await axios.get(`http://localhost:5000/api/creative-services/artist/${profileRes.data.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setServices(servicesRes.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (serviceId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/creative-services/${serviceId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchServices();
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/creative-services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
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

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="text-xl font-bold text-black">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Manage Services</h1>
            <p className="text-gray-600">Edit, activate, or delete your creative services</p>
          </div>
          <button
            onClick={() => navigate('/artist/create-service')}
            className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all whitespace-nowrap"
          >
            + New Service
          </button>
        </div>

        {/* Empty State */}
        {services.length === 0 ? (
          <div className="text-center py-20 border-2 border-gray-300 rounded-lg bg-gray-50">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 font-bold mb-6">No services yet</p>
            <p className="text-gray-500 mb-8">Create your first service to get started</p>
            <button
              onClick={() => navigate('/artist/create-service')}
              className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
            >
              Create Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map(service => (
              <div
                key={service.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-black transition-all cursor-pointer"
                onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
              >
                {/* Service Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b-2 border-gray-100">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getServiceTypeIcon(service.service_type)}</span>
                      <h3 className="text-xl font-bold text-black">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{service.category || 'Uncategorized'}</p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-2">
                    <span className={`px-4 py-2 rounded-lg font-bold text-sm ${
                      service.status === 'active'
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                    }`}>
                      {service.status === 'active' ? '✓ Active' : '○ Inactive'}
                    </span>
                    <span className="px-4 py-2 bg-black text-white rounded-lg font-bold text-sm">
                      {service.service_type === 'commission' && 'Commission'}
                      {service.service_type === 'prerelease' && 'Pre-Release'}
                      {service.service_type === 'booking' && 'Booking'}
                    </span>
                  </div>
                </div>

                {/* Service Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {service.service_type === 'commission' && (
                    <>
                      <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                        <div className="text-xs font-bold text-gray-600 mb-1">Tiers</div>
                        <div className="text-2xl font-bold text-black">{service.tier_count || 0}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                        <div className="text-xs font-bold text-gray-600 mb-1">Orders</div>
                        <div className="text-2xl font-bold text-black">{service.order_count || 0}</div>
                      </div>
                      {service.is_limited && (
                        <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                          <div className="text-xs font-bold text-gray-600 mb-1">Slots</div>
                          <div className="text-2xl font-bold text-black">{service.current_orders}/{service.max_orders_allowed}</div>
                        </div>
                      )}
                    </>
                  )}
                  {service.service_type === 'booking' && (
                    <>
                      <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                        <div className="text-xs font-bold text-gray-600 mb-1">Event Date</div>
                        <div className="text-lg font-bold text-black">{new Date(service.event_date).toLocaleDateString()}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                        <div className="text-xs font-bold text-gray-600 mb-1">Seats</div>
                        <div className="text-2xl font-bold text-black">{service.booked_seats}/{service.total_seats}</div>
                      </div>
                    </>
                  )}
                  {service.service_type === 'prerelease' && (
                    <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                      <div className="text-xs font-bold text-gray-600 mb-1">Release</div>
                      <div className="text-lg font-bold text-black">{new Date(service.release_date).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {expandedService === service.id && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-100 space-y-4">
                    <div>
                      <p className="text-gray-700">{service.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/artist/edit-service/${service.id}`);
                        }}
                        className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
                      >
                        ✎ Edit
                      </button>
                      {service.status === 'active' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(service.id, 'inactive');
                          }}
                          className="px-4 py-2 bg-gray-200 text-black font-bold rounded-lg hover:bg-gray-300 transition-all"
                        >
                          ⏸ Pause
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(service.id, 'active');
                          }}
                          className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
                        >
                          ✓ Activate
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(service.id);
                        }}
                        className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-all"
                      >
                        🗑 Delete
                      </button>
                    </div>
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
