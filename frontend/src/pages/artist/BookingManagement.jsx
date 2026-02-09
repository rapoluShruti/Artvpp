import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const BookingManagement = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const res = await api.get(
        "/creative-services/bookings/artist/all"
      );
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      await api.put(
        `/creative-services/bookings/${bookingId}/approve`
      );
      fetchBookings();
    } catch (err) {
      console.error("Error approving booking:", err);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "border-orange-300 bg-orange-50";
      case "approved":
        return "border-green-300 bg-green-50";
      case "confirmed":
        return "border-blue-300 bg-blue-50";
      case "completed":
        return "border-green-400 bg-green-100";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getStatusText = (status) => {
    const labels = {
      pending: "Pending",
      approved: "Approved",
      confirmed: "Confirmed",
      completed: "Completed",
    };
    return labels[status] || status;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Invite link copied!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold text-black">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600">
            Manage and approve event bookings
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b-2 border-gray-200">
          {["all", "pending", "approved", "confirmed", "completed"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-4 py-2 font-bold rounded-lg transition-all ${
                  activeTab === status
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "All" : getStatusText(status)}
              </button>
            )
          )}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 border-2 border-gray-300 rounded-lg bg-gray-50">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-xl font-bold text-gray-600">
              No bookings
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className={`border-2 rounded-lg p-6 bg-white transition-all ${getStatusColor(
                  booking.status
                )}`}
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b-2 border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-black">
                      {booking.title}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      From:{" "}
                      <span className="font-bold">
                        {booking.first_name} {booking.last_name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Email:{" "}
                      <span className="font-bold">
                        {booking.email}
                      </span>
                    </div>
                  </div>
                  <span className="px-4 py-2 border-2 border-black bg-white font-bold rounded-lg text-sm">
                    {getStatusText(booking.status)}
                  </span>
                </div>

                {/* Booking Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b-2 border-gray-200">
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                    <div className="text-xs font-bold text-gray-600 mb-1">
                      Event Date
                    </div>
                    <div className="font-bold text-black">
                      {new Date(
                        booking.event_date
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                    <div className="text-xs font-bold text-gray-600 mb-1">
                      Time
                    </div>
                    <div className="font-bold text-black">
                      {booking.event_time}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                    <div className="text-xs font-bold text-gray-600 mb-1">
                      Seats
                    </div>
                    <div className="font-bold text-black">
                      {booking.seats_booked}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                    <div className="text-xs font-bold text-gray-600 mb-1">
                      Requested
                    </div>
                    <div className="font-bold text-black">
                      {new Date(
                        booking.created_at
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {booking.location_details && (
                  <div className="mb-4 p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <div className="font-bold text-black mb-2">
                      📍 Location
                    </div>
                    <div className="text-gray-700">
                      {booking.location_details}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {booking.notes && (
                  <div className="mb-4 p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <div className="font-bold text-black mb-2">
                      📝 Notes
                    </div>
                    <div className="text-gray-700">
                      {booking.notes}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {booking.status === "pending" && (
                    <button
                      onClick={() =>
                        handleApproveBooking(booking.id)
                      }
                      className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
                    >
                      ✓ Approve
                    </button>
                  )}

                  {booking.status === "approved" && (
                    <button
                      onClick={() =>
                        copyToClipboard(
                          booking.invite_link_token
                        )
                      }
                      className="px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
                    >
                      📋 Copy Invite Link
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

export default BookingManagement;
