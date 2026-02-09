import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const CustomerBookings = () => {
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
        "/creative-services/bookings/customer/all"
      );
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "confirmed":
        return "Confirmed";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const filteredBookings =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Invite link copied!");
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-white">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="mb-12 text-white">
          <h1 className="text-4xl font-extrabold mb-2">
            My Bookings
          </h1>
          <p className="text-white/70">
            Track your event and workshop bookings
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="flex flex-wrap gap-3 mb-10">
          {["all", "pending", "approved", "confirmed", "completed"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-5 py-2 rounded-full font-semibold transition-all
                ${
                  activeTab === status
                    ? "bg-white text-purple-700 shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {status === "all" ? "All" : getStatusLabel(status)}
              </button>
            )
          )}
        </div>

        {/* EMPTY STATE */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-24 text-white">
            <p className="text-xl mb-6 text-white/80">
              No bookings found
            </p>

            <button
              onClick={() => navigate("/services")}
              className="px-6 py-3 rounded-xl font-semibold text-purple-700
              bg-white hover:bg-gray-100 transition"
            >
              Browse Sessions
            </button>
          </div>
        ) : (

          /* BOOKINGS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white/15 backdrop-blur-xl rounded-2xl
                shadow-xl hover:shadow-2xl transition-all"
              >

                {/* TOP */}
                <div className="p-5 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {booking.title}
                    </h3>

                    <p className="text-sm text-white/70 mt-1">
                      With{" "}
                      <span className="font-semibold">
                        {booking.display_name || "Artist"}
                      </span>
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold 
                  bg-white/25 text-white">
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="px-5 space-y-3 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Event Date</span>
                    <span className="font-semibold text-white">
                      {new Date(booking.event_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Time</span>
                    <span className="font-semibold text-white">
                      {booking.event_time}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Seats</span>
                    <span className="font-semibold text-white">
                      {booking.seats_booked}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Updated</span>
                    <span className="font-semibold text-white">
                      {new Date(booking.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* LOCATION */}
                {booking.location_details && (
                  <div className="px-5 pt-4 text-sm text-white/80">
                    <p className="mb-1">📍 Location</p>
                    <p className="text-white">
                      {booking.location_details}
                    </p>
                  </div>
                )}

                {/* INVITE BUTTON */}
                {booking.status === "approved" &&
                  booking.invite_link_token && (
                    <div className="p-5">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            booking.invite_link_token
                          )
                        }
                        className="w-full px-4 py-3 rounded-xl font-semibold text-white
                        bg-gradient-to-r from-pink-500 to-purple-600
                        hover:scale-[1.02] transition-transform"
                      >
                        Copy Invite Link
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

export default CustomerBookings;
