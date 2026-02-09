// // // import { useState, useEffect } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import axios from 'axios';

// // // const CustomerBookings = () => {
// // //   const navigate = useNavigate();
// // //   const [bookings, setBookings] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [activeTab, setActiveTab] = useState('all');
// // //   const token = localStorage.getItem('token');

// // //   useEffect(() => {
// // //     if (!token) {
// // //       navigate('/login');
// // //       return;
// // //     }
// // //     fetchBookings();
// // //   }, [token, navigate]);

// // //   const fetchBookings = async () => {
// // //     try {
// // //       const res = await axios.get('http://localhost:5000/api/creative-services/bookings/customer/all', {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       });
// // //       setBookings(res.data || []);
// // //     } catch (err) {
// // //       console.error('Error fetching bookings:', err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const filteredBookings = bookings.filter(booking => {
// // //     if (activeTab === 'all') return true;
// // //     return booking.status === activeTab;
// // //   });

// // //   const getStatusColor = (status) => {
// // //     switch(status) {
// // //       case 'pending': return 'border-orange-300 bg-orange-50';
// // //       case 'approved': return 'border-green-300 bg-green-50';
// // //       case 'confirmed': return 'border-blue-300 bg-blue-50';
// // //       case 'completed': return 'border-green-400 bg-green-100';
// // //       default: return 'border-gray-300 bg-gray-50';
// // //     }
// // //   };

// // //   const getStatusText = (status) => {
// // //     const labels = {
// // //       'pending': 'Pending',
// // //       'approved': 'Approved',
// // //       'confirmed': 'Confirmed',
// // //       'completed': 'Completed'
// // //     };
// // //     return labels[status] || status;
// // //   };

// // //   const copyToClipboard = (text) => {
// // //     navigator.clipboard.writeText(text);
// // //     alert('Invite link copied!');
// // //   };

// // //   if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="text-xl font-bold text-black">Loading...</div></div>;

// // //   return (
// // //     <div className="min-h-screen bg-white">
// // //       <div className="max-w-6xl mx-auto px-4 py-12">
// // //         {/* Header */}
// // //         <div className="mb-8">
// // //           <h1 className="text-4xl font-bold text-black mb-2">My Bookings</h1>
// // //           <p className="text-gray-600">Track your event and workshop bookings</p>
// // //         </div>

// // //         {/* Filter Tabs */}
// // //         <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b-2 border-gray-200">
// // //           {['all', 'pending', 'approved', 'confirmed', 'completed'].map(status => (
// // //             <button
// // //               key={status}
// // //               onClick={() => setActiveTab(status)}
// // //               className={`px-4 py-2 font-bold rounded-lg transition-all ${
// // //                 activeTab === status
// // //                   ? 'bg-black text-white'
// // //                   : 'bg-gray-100 text-black hover:bg-gray-200'
// // //               }`}
// // //             >
// // //               {status === 'all' ? 'All' : getStatusText(status)}
// // //             </button>
// // //           ))}
// // //         </div>

// // //         {/* Empty State */}
// // //         {filteredBookings.length === 0 ? (
// // //           <div className="text-center py-16 border-2 border-gray-300 rounded-lg bg-gray-50">
// // //             <div className="text-5xl mb-4">📭</div>
// // //             <p className="text-xl font-bold text-gray-600 mb-6">No bookings</p>
// // //             <button
// // //               onClick={() => navigate('/services')}
// // //               className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
// // //             >
// // //               Browse Sessions
// // //             </button>
// // //           </div>
// // //         ) : (
// // //           <div className="space-y-4">
// // //             {filteredBookings.map(booking => (
// // //               <div key={booking.id} className={`border-2 rounded-lg p-6 bg-white transition-all ${getStatusColor(booking.status)}`}>
// // //                 {/* Header */}
// // //                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b-2 border-gray-200">
// // //                   <div>
// // //                     <h3 className="text-xl font-bold text-black">{booking.title}</h3>
// // //                     <div className="text-sm text-gray-600 mt-1">With: <span className="font-bold">{booking.display_name || 'Artist'}</span></div>
// // //                   </div>
// // //                   <span className="px-4 py-2 border-2 border-black bg-white font-bold rounded-lg text-sm">
// // //                     {getStatusText(booking.status)}
// // //                   </span>
// // //                 </div>

// // //                 {/* Booking Info Grid */}
// // //                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b-2 border-gray-200">
// // //                   <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
// // //                     <div className="text-xs font-bold text-gray-600 mb-1">Event Date</div>
// // //                     <div className="font-bold text-black">{new Date(booking.event_date).toLocaleDateString()}</div>
// // //                   </div>
// // //                   <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
// // //                     <div className="text-xs font-bold text-gray-600 mb-1">Time</div>
// // //                     <div className="font-bold text-black">{booking.event_time}</div>
// // //                   </div>
// // //                   <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
// // //                     <div className="text-xs font-bold text-gray-600 mb-1">Seats</div>
// // //                     <div className="font-bold text-black">{booking.seats_booked}</div>
// // //                   </div>
// // //                   <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
// // //                     <div className="text-xs font-bold text-gray-600 mb-1">Updated</div>
// // //                     <div className="font-bold text-black">{new Date(booking.updated_at).toLocaleDateString()}</div>
// // //                   </div>
// // //                 </div>

// // //                 {/* Location */}
// // //                 {booking.location_details && (
// // //                   <div className="mb-4 p-4 bg-white border-2 border-gray-200 rounded-lg">
// // //                     <div className="font-bold text-black mb-2">📍 Location</div>
// // //                     <div className="text-gray-700">{booking.location_details}</div>
// // //                   </div>
// // //                 )}

// // //                 {/* Invite Link */}
// // //                 {booking.status === 'approved' && booking.invite_link_token && (
// // //                   <button
// // //                     onClick={() => copyToClipboard(booking.invite_link_token)}
// // //                     className="w-full px-4 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
// // //                   >
// // //                     📋 Copy Invite Link
// // //                   </button>
// // //                 )}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CustomerBookings;
// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // const TABS = ["all", "pending", "approved", "confirmed", "completed"];

// // const STATUS_STYLES = {
// //   pending: "bg-orange-100 text-orange-700 border-orange-300",
// //   approved: "bg-emerald-100 text-emerald-700 border-emerald-300",
// //   confirmed: "bg-blue-100 text-blue-700 border-blue-300",
// //   completed: "bg-green-100 text-green-700 border-green-300",
// // };

// // const STATUS_LABELS = {
// //   pending: "Pending",
// //   approved: "Approved",
// //   confirmed: "Confirmed",
// //   completed: "Completed",
// // };

// // export default function CustomerBookings() {
// //   const navigate = useNavigate();
// //   const [bookings, setBookings] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [activeTab, setActiveTab] = useState("all");

// //   const token = localStorage.getItem("token");

// //   useEffect(() => {
// //     if (!token) {
// //       navigate("/login");
// //       return;
// //     }
// //     fetchBookings();
// //   }, []);

// //   const fetchBookings = async () => {
// //     try {
// //       const res = await axios.get(
// //         "http://localhost:5000/api/creative-services/bookings/customer/all",
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );
// //       setBookings(res.data || []);
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const filteredBookings =
// //     activeTab === "all"
// //       ? bookings
// //       : bookings.filter((b) => b.status === activeTab);

// //   const copyToClipboard = (text) => {
// //     navigator.clipboard.writeText(text);
// //     alert("Invite link copied!");
// //   };

// //   /* ---------------- LOADING ---------------- */
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="animate-spin h-10 w-10 rounded-full border-4 border-black border-t-transparent"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="max-w-6xl mx-auto px-4 py-10">

// //         {/* HEADER */}
// //         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
// //           <div>
// //             <h1 className="text-4xl font-extrabold text-gray-900">
// //               My Bookings
// //             </h1>
// //             <p className="text-gray-500 mt-1">
// //               Manage your events & workshops
// //             </p>
// //           </div>

// //           <button
// //             onClick={() => navigate("/services")}
// //             className="mt-4 md:mt-0 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
// //           >
// //             Browse Sessions
// //           </button>
// //         </div>

// //         {/* TABS */}
// //         <div className="flex gap-3 flex-wrap mb-8">
// //           {TABS.map((tab) => (
// //             <button
// //               key={tab}
// //               onClick={() => setActiveTab(tab)}
// //               className={`px-5 py-2 rounded-full font-semibold border transition
// //               ${
// //                 activeTab === tab
// //                   ? "bg-black text-white border-black"
// //                   : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
// //               }`}
// //             >
// //               {tab === "all" ? "All" : STATUS_LABELS[tab]}
// //             </button>
// //           ))}
// //         </div>

// //         {/* EMPTY */}
// //         {filteredBookings.length === 0 && (
// //           <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
// //             <div className="text-6xl mb-4">📭</div>
// //             <h2 className="text-2xl font-bold text-gray-800">
// //               No bookings found
// //             </h2>
// //             <p className="text-gray-500 mt-2">
// //               Start by browsing available services.
// //             </p>
// //           </div>
// //         )}

// //         {/* BOOKINGS GRID */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           {filteredBookings.map((booking) => (
// //             <div
// //               key={booking.id}
// //               className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-200 p-6 flex flex-col"
// //             >
// //               {/* TOP */}
// //               <div className="flex justify-between items-start mb-4">
// //                 <div>
// //                   <h3 className="text-xl font-bold text-gray-900">
// //                     {booking.title}
// //                   </h3>
// //                   <p className="text-sm text-gray-500">
// //                     With{" "}
// //                     <span className="font-semibold">
// //                       {booking.display_name || "Artist"}
// //                     </span>
// //                   </p>
// //                 </div>

// //                 <span
// //                   className={`px-3 py-1 rounded-full text-sm font-semibold border ${
// //                     STATUS_STYLES[booking.status]
// //                   }`}
// //                 >
// //                   {STATUS_LABELS[booking.status]}
// //                 </span>
// //               </div>

// //               {/* DETAILS */}
// //               <div className="grid grid-cols-2 gap-4 text-sm mb-5">
// //                 <div>
// //                   <p className="text-gray-500">Date</p>
// //                   <p className="font-semibold">
// //                     {new Date(booking.event_date).toLocaleDateString()}
// //                   </p>
// //                 </div>

// //                 <div>
// //                   <p className="text-gray-500">Time</p>
// //                   <p className="font-semibold">{booking.event_time}</p>
// //                 </div>

// //                 <div>
// //                   <p className="text-gray-500">Seats</p>
// //                   <p className="font-semibold">{booking.seats_booked}</p>
// //                 </div>

// //                 <div>
// //                   <p className="text-gray-500">Last Updated</p>
// //                   <p className="font-semibold">
// //                     {new Date(booking.updated_at).toLocaleDateString()}
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* LOCATION */}
// //               {booking.location_details && (
// //                 <div className="bg-gray-50 border rounded-xl p-4 mb-4">
// //                   <p className="font-semibold mb-1">📍 Location</p>
// //                   <p className="text-gray-600">
// //                     {booking.location_details}
// //                   </p>
// //                 </div>
// //               )}

// //               {/* INVITE BUTTON */}
// //               {booking.status === "approved" &&
// //                 booking.invite_link_token && (
// //                   <button
// //                     onClick={() =>
// //                       copyToClipboard(booking.invite_link_token)
// //                     }
// //                     className="mt-auto bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
// //                   >
// //                     Copy Invite Link
// //                   </button>
// //                 )}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const CustomerBookings = () => {
//   const navigate = useNavigate();

//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("all");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/creative-services/bookings/customer/all",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setBookings(res.data || []);
//     } catch (err) {
//       console.error("Error fetching bookings:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusLabel = (status) => {
//     switch (status) {
//       case "pending":
//         return "Pending";
//       case "approved":
//         return "Approved";
//       case "confirmed":
//         return "Confirmed";
//       case "completed":
//         return "Completed";
//       default:
//         return status;
//     }
//   };

//   const filteredBookings =
//     activeTab === "all"
//       ? bookings
//       : bookings.filter((b) => b.status === activeTab);

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     alert("Invite link copied!");
//   };

//   /* ---------------- LOADING ---------------- */

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
//           <p className="text-black text-sm">Loading bookings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 py-12">

//         {/* HEADER */}
//         <div className="mb-12">
//           <h1 className="text-4xl font-bold text-black mb-2">
//             My Bookings
//           </h1>
//           <p className="text-gray-600">
//             Track your event and workshop bookings
//           </p>
//         </div>

//         {/* FILTER TABS */}
//         <div className="flex flex-wrap gap-3 mb-10">
//           {["all", "pending", "approved", "confirmed", "completed"].map(
//             (status) => (
//               <button
//                 key={status}
//                 onClick={() => setActiveTab(status)}
//                 className={`px-4 py-2 rounded-lg font-bold transition-all
//                   ${
//                     activeTab === status
//                       ? "bg-black text-white"
//                       : "bg-gray-100 text-black hover:bg-gray-200"
//                   }`}
//               >
//                 {status === "all" ? "All" : getStatusLabel(status)}
//               </button>
//             )
//           )}
//         </div>

//         {/* EMPTY STATE */}
//         {filteredBookings.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-gray-500 text-lg mb-6">
//               No bookings found
//             </p>

//             <button
//               onClick={() => navigate("/services")}
//               className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition"
//             >
//               Browse Sessions
//             </button>
//           </div>
//         ) : (

//           /* BOOKINGS GRID */
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//             {filteredBookings.map((booking) => (
//               <div
//                 key={booking.id}
//                 className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
//               >

//                 {/* TOP */}
//                 <div className="p-5 border-b border-gray-200 flex justify-between items-start">
//                   <div>
//                     <h3 className="text-lg font-bold text-black">
//                       {booking.title}
//                     </h3>

//                     <p className="text-sm text-gray-600 mt-1">
//                       With{" "}
//                       <span className="font-bold">
//                         {booking.display_name || "Artist"}
//                       </span>
//                     </p>
//                   </div>

//                   <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-bold">
//                     {getStatusLabel(booking.status)}
//                   </span>
//                 </div>

//                 {/* DETAILS */}
//                 <div className="p-5 space-y-3 text-sm">

//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Event Date</span>
//                     <span className="font-bold text-black">
//                       {new Date(
//                         booking.event_date
//                       ).toLocaleDateString()}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Time</span>
//                     <span className="font-bold text-black">
//                       {booking.event_time}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Seats</span>
//                     <span className="font-bold text-black">
//                       {booking.seats_booked}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Updated</span>
//                     <span className="font-bold text-black">
//                       {new Date(
//                         booking.updated_at
//                       ).toLocaleDateString()}
//                     </span>
//                   </div>

//                 </div>

//                 {/* LOCATION */}
//                 {booking.location_details && (
//                   <div className="px-5 pb-5 text-sm">
//                     <p className="text-gray-500 mb-1">📍 Location</p>
//                     <p className="text-black">
//                       {booking.location_details}
//                     </p>
//                   </div>
//                 )}

//                 {/* INVITE LINK */}
//                 {booking.status === "approved" &&
//                   booking.invite_link_token && (
//                     <div className="p-5 border-t border-gray-200">
//                       <button
//                         onClick={() =>
//                           copyToClipboard(
//                             booking.invite_link_token
//                           )
//                         }
//                         className="w-full px-4 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition"
//                       >
//                         Copy Invite Link
//                       </button>
//                     </div>
//                   )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerBookings;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/creative-services/bookings/customer/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
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

        {/* EMPTY */}
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
                      {new Date(
                        booking.event_date
                      ).toLocaleDateString()}
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
                      {new Date(
                        booking.updated_at
                      ).toLocaleDateString()}
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
