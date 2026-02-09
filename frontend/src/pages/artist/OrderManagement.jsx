// import { useState, useEffect } from "react";
// import api from "../../api";

// export default function OrderManagement() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState(false);

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const loadOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/orders/artist/orders");
//       setOrders(res.data);
//     } catch (err) {
//       console.error("Error loading orders:", err);
//       alert("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       confirmed: "bg-blue-100 text-blue-800",
//       processing: "bg-yellow-100 text-yellow-800",
//       dispatched: "bg-purple-100 text-purple-800",
//       received: "bg-green-100 text-green-800",
//       pending: "bg-gray-100 text-gray-800",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800";
//   };

//   const getPaymentStatusColor = (status) => {
//     return status === "completed" ? "text-green-600" : "text-orange-600";
//   };

//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       setUpdatingStatus(true);
//       await api.put(`/orders/${orderId}/status`, { status: newStatus });
      
//       // Update local state
//       setOrders(orders.map(order => 
//         order.id === orderId ? { ...order, status: newStatus } : order
//       ));
      
//       alert(`✓ Order status updated to ${newStatus}`);
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Failed to update order status");
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center"><p>Loading orders...</p></div>;
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-bold mb-8">Order Management</h1>
//           <div className="bg-white p-12 rounded-lg text-center">
//             <p className="text-lg text-gray-600">No orders yet</p>
//             <p className="text-sm text-gray-500 mt-2">Once customers purchase your products, orders will appear here</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8">📦 Order Management</h1>

//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
//               {/* Order Header */}
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold">Order #{order.id}</h2>
//                   <p className="text-sm text-gray-600 mt-2">
//                     📅 {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-green-600">₹{parseFloat(order.total_amount).toFixed(2)}</div>
//                   <div className="flex gap-2 mt-2 justify-end flex-wrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
//                       {order.status.toUpperCase()}
//                     </span>
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
//                       💳 {order.payment_status.toUpperCase()}
//                     </span>
//                     {order.payment_type && (
//                       <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
//                         {order.payment_type === "offline" ? "🚚 COD" : "💰 Online"}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div className="p-6 border-b">
//                 <h3 className="font-bold text-lg mb-4">📦 Items Ordered</h3>
//                 <div className="space-y-3">
//                   {order.items.map((item, idx) => (
//                     <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
//                       <div>
//                         <p className="font-semibold">{item.title}</p>
//                         <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Customer Information */}
//               {order.customer_info && (
//                 <div className="p-6 border-b bg-blue-50">
//                   <h3 className="font-bold text-lg mb-4">👤 Customer Information</h3>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-gray-600">Email</p>
//                       <p className="font-semibold break-all">{order.customer_info.email}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Phone</p>
//                       <p className="font-semibold">{order.customer_info.phone}</p>
//                     </div>
//                     <div className="col-span-2">
//                       <p className="text-gray-600">Delivery Address</p>
//                       <p className="font-semibold">{order.customer_info.address}</p>
//                     </div>
//                     <div className="col-span-2">
//                       <p className="text-gray-600">City/Location</p>
//                       <p className="font-semibold">{order.customer_info.location}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Status Management */}
//               <div className="p-6 bg-yellow-50">
//                 <h3 className="font-bold text-lg mb-4">🔄 Update Order Status</h3>
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
//                   {["confirmed", "processing", "dispatched", "received"].map((status) => (
//                     <button
//                       key={status}
//                       onClick={() => handleStatusUpdate(order.id, status)}
//                       disabled={updatingStatus || order.status === status}
//                       className={`py-2 px-3 rounded font-semibold text-sm transition ${
//                         order.status === status
//                           ? `${getStatusColor(status)} cursor-default`
//                           : "bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
//                       } disabled:opacity-50`}
//                     >
//                       {status.charAt(0).toUpperCase() + status.slice(1)}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Status Timeline */}
//                 <div className="mt-6 flex items-center justify-between text-xs">
//                   <div className={`text-center ${["confirmed", "processing", "dispatched", "received"].indexOf(order.status) >= 0 ? "text-green-600 font-bold" : "text-gray-400"}`}>
//                     ✓ Confirmed
//                   </div>
//                   <div className={`h-1 flex-1 mx-2 ${["processing", "dispatched", "received"].indexOf(order.status) >= 0 ? "bg-green-600" : "bg-gray-300"}`}></div>
//                   <div className={`text-center ${["processing", "dispatched", "received"].indexOf(order.status) >= 0 ? "text-green-600 font-bold" : "text-gray-400"}`}>
//                     ↻ Processing
//                   </div>
//                   <div className={`h-1 flex-1 mx-2 ${["dispatched", "received"].indexOf(order.status) >= 0 ? "bg-green-600" : "bg-gray-300"}`}></div>
//                   <div className={`text-center ${["dispatched", "received"].indexOf(order.status) >= 0 ? "text-green-600 font-bold" : "text-gray-400"}`}>
//                     📦 Dispatched
//                   </div>
//                   <div className={`h-1 flex-1 mx-2 ${order.status === "received" ? "bg-green-600" : "bg-gray-300"}`}></div>
//                   <div className={`text-center ${order.status === "received" ? "text-green-600 font-bold" : "text-gray-400"}`}>
//                     ✔ Received
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import api from "../../api";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/artist/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      processing: "bg-amber-50 text-amber-700 border-amber-200",
      dispatched: "bg-purple-50 text-purple-700 border-purple-200",
      received: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-slate-50 text-slate-700 border-slate-200",
    };
    return colors[status] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      processing: (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      dispatched: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      received: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      pending: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[status] || icons.pending;
  };

  const getPaymentStatusColor = (status) => {
    return status === "completed" 
      ? "text-emerald-600 bg-emerald-50 border-emerald-200" 
      : "text-amber-600 bg-amber-50 border-amber-200";
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right';
      notification.innerHTML = `<div class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Order status updated to ${newStatus}</span></div>`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = searchQuery === "" || 
      order.id.toString().includes(searchQuery) ||
      order.customer_info?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const orderStats = {
    total: orders.length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    processing: orders.filter(o => o.status === "processing").length,
    dispatched: orders.filter(o => o.status === "dispatched").length,
    received: orders.filter(o => o.status === "received").length,
  };

  // Calculate total revenue safely
  let totalRevenue = 0;
  orders.forEach(order => {
    const amount = parseFloat(order.total_amount);
    if (!isNaN(amount) && isFinite(amount)) {
      totalRevenue += amount;
    }
  });
  
  console.log('Total Revenue Calculated:', totalRevenue, 'from', orders.length, 'orders');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Order Management</h1>
            <p className="text-slate-600">Manage and track all your customer orders</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders yet</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Once customers purchase your products, orders will appear here for you to manage and fulfill.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Order Management</h1>
          <p className="text-slate-600">Manage and track all your customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Total Orders</span>
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{orderStats.total}</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Confirmed</span>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                {getStatusIcon("confirmed")}
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700">{orderStats.confirmed}</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-600">Processing</span>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                {getStatusIcon("processing")}
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-700">{orderStats.processing}</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-600">Dispatched</span>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                {getStatusIcon("dispatched")}
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-700">{orderStats.dispatched}</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-600">Received</span>
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                {getStatusIcon("received")}
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700">{orderStats.received}</div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-100">Total Revenue</span>
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">₹{(isNaN(totalRevenue) || !isFinite(totalRevenue) ? 0 : totalRevenue).toFixed(2)}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by order ID or customer email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {["all", "confirmed", "processing", "dispatched", "received"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    filterStatus === status
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <div 
              key={order.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-slate-900">Order #{order.id}</h2>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-slate-900">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(order.payment_status)}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment: {order.payment_status.toUpperCase()}
                  </span>
                  {order.payment_type && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {order.payment_type === "offline" ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Cash on Delivery
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Online Payment
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-600 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Unit Price</p>
                        <p className="font-bold text-slate-900">₹{parseFloat(item.price).toFixed(2)}</p>
                        <p className="text-xs text-slate-500 mt-1">Total: ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              {order.customer_info && (
                <div className="p-6 bg-blue-50/50 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <p className="text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Email</p>
                      <p className="font-medium text-slate-900 break-all">{order.customer_info.email}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <p className="text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Phone</p>
                      <p className="font-medium text-slate-900">{order.customer_info.phone}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 md:col-span-2">
                      <p className="text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Delivery Address</p>
                      <p className="font-medium text-slate-900">{order.customer_info.address}</p>
                      <p className="text-sm text-slate-600 mt-1">{order.customer_info.location}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Management */}
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Update Order Status
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {["confirmed", "processing", "dispatched", "received"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(order.id, status)}
                      disabled={updatingStatus || order.status === status}
                      className={`relative py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        order.status === status
                          ? `${getStatusColor(status)} border shadow-sm cursor-default`
                          : "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 shadow-sm hover:shadow-md"
                      } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                      {getStatusIcon(status)}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Status Timeline */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {["confirmed", "processing", "dispatched", "received"].map((status, idx) => {
                      const isActive = ["confirmed", "processing", "dispatched", "received"].indexOf(order.status) >= idx;
                      return (
                        <div key={status} className="flex items-center flex-1">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isActive 
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                                : "bg-slate-200 text-slate-500"
                            }`}>
                              {isActive ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="text-sm font-bold">{idx + 1}</span>
                              )}
                            </div>
                            <p className={`text-xs mt-2 font-medium text-center ${isActive ? "text-emerald-600" : "text-slate-500"}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </p>
                          </div>
                          {idx < 3 && (
                            <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                              ["processing", "dispatched", "received"].indexOf(order.status) >= idx 
                                ? "bg-emerald-500" 
                                : "bg-slate-200"
                            }`}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-900 mb-2">No orders found</p>
            <p className="text-slate-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}