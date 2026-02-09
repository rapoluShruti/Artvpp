import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ServiceOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/creative-services/orders/artist/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/creative-services/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'requested': return 'border-orange-300 bg-orange-50';
      case 'accepted': return 'border-blue-300 bg-blue-50';
      case 'in_progress': return 'border-purple-300 bg-purple-50';
      case 'delivered': return 'border-green-300 bg-green-50';
      case 'completed': return 'border-green-400 bg-green-100';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'requested': return 'Requested';
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'delivered': return 'Delivered';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getNextAction = (status) => {
    switch(status) {
      case 'requested':
        return { label: '✓ Accept', newStatus: 'accepted' };
      case 'accepted':
        return { label: '▶ Start Work', newStatus: 'in_progress' };
      case 'in_progress':
        return { label: '→ Deliver', newStatus: 'delivered' };
      case 'delivered':
        return { label: '✓ Complete', newStatus: 'completed' };
      default:
        return null;
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="text-xl font-bold text-black">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Service Orders</h1>
          <p className="text-gray-600">Manage commission requests and delivery status</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b-2 border-gray-200">
          {['all', 'requested', 'accepted', 'in_progress', 'delivered', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 font-bold rounded-lg transition-all ${
                activeTab === status
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Orders' : getStatusText(status)}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 border-2 border-gray-300 rounded-lg bg-gray-50">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-xl font-bold text-gray-600">No orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className={`border-2 rounded-lg p-6 bg-white transition-all ${getStatusColor(order.status)}`}>
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b-2 border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-black">{order.title}</h3>
                    <div className="text-sm text-gray-600 mt-1">Tier: <span className="font-bold">{order.tier_name}</span></div>
                    <div className="text-sm text-gray-600">From: <span className="font-bold">{order.first_name} {order.last_name}</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-black text-white font-bold rounded-lg text-sm">
                      ${order.price}
                    </span>
                    <span className="px-4 py-2 border-2 border-black bg-white font-bold rounded-lg text-sm">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b-2 border-gray-200">
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                    <div className="text-xs font-bold text-gray-600 mb-1">Due Date</div>
                    <div className="font-bold text-black">{new Date(order.due_date).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                    <div className="text-xs font-bold text-gray-600 mb-1">Revisions</div>
                    <div className="font-bold text-black">{order.revisions_used} used</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200 md:col-span-2">
                    <div className="text-xs font-bold text-gray-600 mb-1">Customer</div>
                    <div className="font-bold text-black truncate">{order.email}</div>
                  </div>
                </div>

                {/* Requirements */}
                {order.requirements && (
                  <div className="mb-4 p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <div className="font-bold text-black mb-2">Requirements:</div>
                    <div className="text-gray-700">{order.requirements}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {getNextAction(order.status) && (
                    <button
                      onClick={() => handleStatusChange(order.id, getNextAction(order.status).newStatus)}
                      className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
                    >
                      {getNextAction(order.status).label}
                    </button>
                  )}
                  {order.status !== 'completed' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Cancel this order?')) {
                          handleStatusChange(order.id, 'cancelled');
                        }
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-all"
                    >
                      ✕ Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceOrders;
