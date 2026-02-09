import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';

const ServiceDetail = () => {
  const { service_id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [artist, setArtist] = useState(null);
  const [requirements, setRequirements] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingNotes, setBookingNotes] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchService();
  }, [service_id]);

  const fetchService = async () => {
    try {
      const res = await api.get(`/creative-services/${service_id}`);

      setService(res.data);

      if (res.data.artist_id) {
        const artistRes = await api.get(`/artists/${res.data.artist_id}`);

        setArtist(artistRes.data);
      }

      if (res.data.service_type === 'commission' && res.data.tiers && res.data.tiers.length > 0) {
        setSelectedTier(res.data.tiers[0].id);
      }
    } catch (err) {
      console.error('Error fetching service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (!selectedTier) {
      alert('Please select a tier');
      return;
    }

    setOrdering(true);
    try {
     await api.post('/creative-services/orders/create', {

        service_id,
        tier_id: selectedTier,
        requirements
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Order placed successfully!');
      navigate('/customer/orders');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  const handlePlacePreorder = async () => {
    if (!token) {
      alert('Please login to pre-order');
      navigate('/login');
      return;
    }

    setOrdering(true);
    try {
     await api.post('/creative-services/preorders/create', {

        service_id,
        tier_id: null,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Pre-order placed successfully!');
      navigate('/customer/preorders');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to place pre-order');
    } finally {
      setOrdering(false);
    }
  };

  const handleRequestBooking = async () => {
    if (!token) {
      alert('Please login to book a session');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    setOrdering(true);
    try {
    await api.post('/creative-services/bookings/request', {

        service_id,
        seats_booked: selectedSeats.length,
        seat_numbers: selectedSeats,
        notes: bookingNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Booking request sent! Waiting for artist approval.');
      navigate('/customer/bookings');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to request booking');
    } finally {
      setOrdering(false);
    }
  };

  const getServiceIcon = (type) => {
    switch(type) {
      case 'commission': return '🎨';
      case 'prerelease': return '🚀';
      case 'booking': return '📅';
      default: return '⭐';
    }
  };

  const getServiceLabel = (type) => {
    switch(type) {
      case 'commission': return 'Commission Service';
      case 'prerelease': return 'Pre-Release Product';
      case 'booking': return 'Bookable Session';
      default: return 'Service';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-black text-sm">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Service not found</p>
          <button
            onClick={() => navigate('/services')}
            className="px-6 py-2 border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const isUnavailable = service.is_limited && service.current_orders >= service.max_orders_allowed;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/services')}
          className="mb-6 px-4 py-2 border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all"
        >
          ← Back
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image */}
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden text-6xl">
            {service.main_image_url ? (
              <img
                src={service.main_image_url}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            ) : (
              getServiceIcon(service.service_type)
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Type Badge */}
            <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-bold mb-4 w-fit">
              {getServiceIcon(service.service_type)} {getServiceLabel(service.service_type)}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-black mb-6">{service.title}</h1>

            {/* Artist Info */}
            {artist && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-6">
                <div className="font-bold text-black">{artist.display_name || 'Artist'}</div>
                <div className="text-sm text-gray-600">Verified Artist</div>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed mb-6">{service.description}</p>

            {/* Info Grid */}
            <div className="space-y-4 border-t-2 border-gray-200 pt-6">
              {service.category && (
                <div>
                  <div className="text-sm font-bold text-gray-600">CATEGORY</div>
                  <div className="text-black">📁 {service.category}</div>
                </div>
              )}

              {service.service_type === 'commission' && (
                <>
                  <div>
                    <div className="text-sm font-bold text-gray-600">SERVICE TYPE</div>
                    <div className="text-black">Custom Commission</div>
                  </div>
                  {service.is_limited && (
                    <div>
                      <div className="text-sm font-bold text-gray-600">AVAILABILITY</div>
                      <div className={isUnavailable ? 'text-red-600 font-bold' : 'text-black'}>
                        {isUnavailable ? '🔴 Fully Booked' : `✓ ${service.max_orders_allowed - service.current_orders} slots available`}
                      </div>
                    </div>
                  )}
                </>
              )}

              {service.service_type === 'booking' && (
                <>
                  <div>
                    <div className="text-sm font-bold text-gray-600">DATE</div>
                    <div className="text-black">📅 {new Date(service.event_date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-600">TIME</div>
                    <div className="text-black">⏰ {service.event_time}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-600">AVAILABLE SEATS</div>
                    <div className="text-black">🎟️ {service.total_seats - service.booked_seats} seats</div>
                  </div>
                </>
              )}

              {service.service_type === 'prerelease' && (
                <div>
                  <div className="text-sm font-bold text-gray-600">RELEASE DATE</div>
                  <div className="text-black">🚀 {new Date(service.release_date).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ordering Section */}
        {service.service_type === 'commission' && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Select Your Package</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {service.tiers && service.tiers.map(tier => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${
                    selectedTier === tier.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-black hover:border-black'
                  }`}
                >
                  <div className="font-bold text-lg mb-2">{tier.tier_name}</div>
                  <div className={`text-3xl font-bold mb-3 ${selectedTier === tier.id ? 'text-yellow-300' : 'text-black'}`}>
                    ${tier.price}
                  </div>
                  <div className="text-sm mb-2 opacity-75">⏱️ {tier.delivery_days} days delivery</div>
                  <div className="text-sm mb-2 opacity-75">✏️ {tier.num_revisions} revisions</div>
                  {tier.included_features && tier.included_features.length > 0 && (
                    <div className="text-sm opacity-75">✓ {tier.included_features.length} features</div>
                  )}
                </div>
              ))}
            </div>

            {selectedTier && (
              <div className="bg-white border-2 border-black rounded-lg p-6">
                <label className="block font-bold text-black mb-3">Tell us about your project</label>
                <textarea
                  placeholder="Describe your requirements, style preferences, and any specific details..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500 mb-6 h-32"
                />
                <button
                  onClick={handlePlaceOrder}
                  disabled={ordering || isUnavailable}
                  className={`w-full py-3 font-bold rounded-lg transition-all text-lg ${
                    isUnavailable
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-black text-white border-2 border-black hover:bg-white hover:text-black'
                  }`}
                >
                  {ordering ? 'Placing Order...' : isUnavailable ? 'Unavailable' : '🛒 Place Order'}
                </button>
              </div>
            )}
          </div>
        )}

        {service.service_type === 'prerelease' && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Pre-Order This Product</h2>
            
            <div className="bg-white border-2 border-black rounded-lg p-6 mb-6">
              <div className="mb-4">
                <div className="text-sm font-bold text-gray-600 mb-2">PRICE</div>
                <div className="text-3xl font-bold text-black">${service.extra_revision_price}</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600 mb-2">PRODUCT TYPE</div>
                <div className="text-black">{service.is_digital ? 'Digital' : 'Physical'} - {service.product_type}</div>
              </div>
            </div>

            <button
              onClick={handlePlacePreorder}
              disabled={ordering}
              className="w-full py-3 bg-black text-white font-bold rounded-lg border-2 border-black hover:bg-white hover:text-black transition-all text-lg"
            >
              {ordering ? 'Processing...' : '🚀 Pre-Order Now'}
            </button>
          </div>
        )}

        {service.service_type === 'booking' && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Select Your Seats</h2>
            
            {service.location_details && (
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-6">
                <div className="text-sm font-bold text-gray-600 mb-2">LOCATION</div>
                <div className="text-black">📍 {service.location_details}</div>
              </div>
            )}

            <div className="bg-white border-2 border-black rounded-lg p-8">
              {/* Seat Legend */}
              <div className="mb-8 flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                    1
                  </div>
                  <span className="text-gray-700">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 border-2 border-green-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                    1
                  </div>
                  <span className="text-gray-700">Booked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 border-2 border-blue-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                    1
                  </div>
                  <span className="text-gray-700">Selected</span>
                </div>
              </div>

              {/* Seat Grid */}
              <div className="mb-8">
                <div className="text-center mb-4 font-bold text-gray-600">🎭 STAGE</div>
                <div className="flex flex-wrap gap-3 justify-center bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                  {Array.from({ length: service.total_seats || 20 }, (_, i) => {
                    const seatNum = i + 1;
                    const isBooked = seatNum > (service.total_seats - service.booked_seats);
                    const isSelected = selectedSeats.includes(seatNum);

                    return (
                      <button
                        key={seatNum}
                        onClick={() => {
                          if (!isBooked) {
                            if (isSelected) {
                              setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
                            } else {
                              setSelectedSeats([...selectedSeats, seatNum]);
                            }
                          }
                        }}
                        disabled={isBooked}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all border-2 flex items-center justify-center ${
                          isBooked
                            ? 'bg-green-500 border-green-600 text-white cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-500 border-blue-600 text-white shadow-lg scale-110'
                            : 'bg-gray-300 border-gray-400 text-gray-700 hover:bg-gray-400 hover:border-gray-500 cursor-pointer'
                        }`}
                      >
                        {seatNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Seats Summary */}
              {selectedSeats.length > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                  <div className="font-bold text-black mb-2">
                    Selected Seats ({selectedSeats.length}):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.sort((a, b) => a - b).map(seat => (
                      <span key={seat} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">
                        Seat {seat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="mb-6">
                <label className="block font-bold text-black mb-3">Notes (Optional)</label>
                <textarea
                  placeholder="Any special requirements or notes?"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500 h-24"
                />
              </div>

              {/* Book Button */}
              <button
                onClick={handleRequestBooking}
                disabled={ordering || selectedSeats.length === 0}
                className={`w-full py-3 font-bold rounded-lg border-2 transition-all text-lg ${
                  selectedSeats.length === 0 || ordering
                    ? 'bg-gray-400 border-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-black text-white border-black hover:bg-white hover:text-black'
                }`}
              >
                {ordering ? 'Sending Request...' : `📅 Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
