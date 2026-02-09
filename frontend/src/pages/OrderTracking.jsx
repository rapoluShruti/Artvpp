import { useState, useEffect } from "react";
import api from "../api";

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryDate = (order) => {
    const date = new Date(order.created_at);
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const filterOrders = () => {
    if (selectedFilter === "all") return orders;
    return orders.filter(order => order.status === selectedFilter);
  };

  // Invoice Component with Professional Design & QR Code
  const Invoice = ({ order }) => {
    if (!order) return null;
    
    const subtotal = order.items ? order.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0) : 0;
    const sgst = subtotal * 0.09;
    const cgst = subtotal * 0.09;
    const gst = sgst + cgst;
    const total = subtotal + gst;
    
    // Generate QR code URL using qr-server API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`Order: ${order.id} | Amount: ₹${total.toFixed(2)}`)}`

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 80px rgba(0,0,0,0.25)'
        }}>
          {/* Header - Black & White */}
          <div style={{ background: 'white', padding: '50px 40px', borderBottom: '2px solid #000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px', color: '#000' }}>INVOICE</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>ArtVPP Commerce</div>
              </div>
              <div style={{ textAlign: 'right', border: '2px solid #000', padding: '16px 20px', borderRadius: '0' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '6px', color: '#000', textTransform: 'uppercase' }}>ORDER ID</div>
                <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'monospace', color: '#000' }}>#{order.id.substring(0, 10).toUpperCase()}</div>
              </div>
            </div>

            {/* Date & Customer Name */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #000' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px', color: '#000', textTransform: 'uppercase' }}>Date Issued</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>
                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px', color: '#000', textTransform: 'uppercase' }}>Bill To</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#000' }}>{order.customer_info?.email?.split('@')[0] || 'Valued Customer'}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ padding: '40px', background: 'white' }}>
            {/* Customer Details */}
            <div style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#000', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Address</div>
                <div style={{ fontSize: '14px', color: '#000', lineHeight: '1.8', fontWeight: 500 }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>{order.customer_info?.email || 'Customer'}</div>
                  <div style={{ opacity: 0.9 }}>{order.customer_info?.address || 'Address not available'}</div>
                  <div style={{ opacity: 0.9 }}>{order.customer_info?.location || 'Location not available'}</div>
                  <div style={{ opacity: 0.9, marginTop: '6px' }}>{order.customer_info?.phone || 'Phone not available'}</div>
                </div>
              </div>
              
              {/* QR Code - Black & White */}
              <div style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '0', border: '2px solid #000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img src={qrCodeUrl} alt="Order QR Code" style={{ width: '120px', height: '120px', borderRadius: '0', marginBottom: '12px', border: 'none' }} />
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#000', letterSpacing: '0.5px' }}>SCAN TO VERIFY</div>
              </div>
            </div>

            {/* Items Table - Black & White */}
            <div style={{ marginBottom: '32px', borderRadius: '0', overflow: 'hidden', border: '2px solid #000' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#000' }}>
                    <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #000' }}>Product Description</th>
                    <th style={{ textAlign: 'center', padding: '16px 20px', fontSize: '12px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #000', width: '60px' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '16px 20px', fontSize: '12px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #000', width: '100px' }}>Unit Price</th>
                    <th style={{ textAlign: 'right', padding: '16px 20px', fontSize: '12px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #000', width: '100px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #e0e0e0' }}>
                      <td style={{ padding: '18px 20px', fontSize: '14px', color: '#000', fontWeight: 500 }}>
                        <div style={{ marginBottom: '4px' }}>{item.title || 'Product'}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Art Item</div>
                      </td>
                      <td style={{ padding: '18px 20px', textAlign: 'center', fontSize: '14px', color: '#000', fontWeight: 600 }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '18px 20px', textAlign: 'right', fontSize: '14px', color: '#000', fontWeight: 500 }}>
                        ₹{parseFloat(item.price).toFixed(2)}
                      </td>
                      <td style={{ padding: '18px 20px', textAlign: 'right', fontSize: '14px', fontWeight: 700, color: '#000' }}>
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section - Black & White */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
              <div style={{ width: '320px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #000', fontSize: '14px', color: '#000' }}>
                  <span style={{ fontWeight: 600 }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#000' }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #000', fontSize: '14px', color: '#000' }}>
                  <span style={{ fontWeight: 600 }}>SGST (9%)</span>
                  <span style={{ fontWeight: 600, color: '#000' }}>₹{sgst.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '2px solid #000', fontSize: '14px', color: '#000' }}>
                  <span style={{ fontWeight: 600 }}>CGST (9%)</span>
                  <span style={{ fontWeight: 600, color: '#000' }}>₹{cgst.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 16px', background: '#000', borderRadius: '0', color: '#fff', marginTop: '12px', fontWeight: 700, fontSize: '16px' }}>
                  <span>TOTAL</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Status Badge - Black & White */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '0', marginBottom: '24px', borderLeft: '4px solid #000' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                ✓ {order.payment_type === 'offline' ? 'Cash on Delivery' : 'Payment Completed'}
              </div>
              <div style={{ fontSize: '13px', color: '#000', fontWeight: 500 }}>
                {order.payment_type === 'offline' ? `Pay ₹${total.toFixed(2)} to delivery partner` : `₹${total.toFixed(2)} paid via online`}
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '2px solid #000', fontSize: '13px', color: '#000', lineHeight: '1.8' }}>
              <div style={{ fontWeight: 600, marginBottom: '6px', color: '#000' }}>Thank you for supporting artists!</div>
              <div>Support: support@artvpp.com | Phone: +91-XXXX-XXXX-XX</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', padding: '24px 40px', borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <button onClick={() => setInvoiceOrder(null)} style={{
              flex: 1,
              padding: '12px 20px',
              border: '2px solid #000',
              background: 'white',
              color: '#000',
              borderRadius: '0',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.target.style.background = '#f5f5f5'; }} onMouseOut={(e) => { e.target.style.background = 'white'; }}>
              ✕ Close
            </button>
            <button onClick={() => window.print()} style={{
              flex: 1,
              padding: '12px 20px',
              background: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '0',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.target.style.background = '#222'; }} onMouseOut={(e) => { e.target.style.background = '#000'; }}>
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    );
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EAF2FF' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-black text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#EAF2FF' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-8 text-black">Your Orders</h1>
          <div className="bg-white rounded p-16 text-center">
            <p className="text-xl font-semibold mb-2 text-black">No orders yet</p>
            <p className="text-sm text-black opacity-60">Your orders will appear here once you make a purchase</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = filterOrders();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EAF2FF' }}>
      {invoiceOrder && <Invoice order={invoiceOrder} />}
      {/* Header */}
      <div className="bg-white border-b border-black">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-black">Your Orders</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded mb-6 p-1 inline-flex gap-1">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-5 py-2 text-sm font-medium transition ${
              selectedFilter === "all"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setSelectedFilter("confirmed")}
            className={`px-5 py-2 text-sm font-medium transition ${
              selectedFilter === "confirmed"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setSelectedFilter("processing")}
            className={`px-5 py-2 text-sm font-medium transition ${
              selectedFilter === "processing"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setSelectedFilter("dispatched")}
            className={`px-5 py-2 text-sm font-medium transition ${
              selectedFilter === "dispatched"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => setSelectedFilter("received")}
            className={`px-5 py-2 text-sm font-medium transition ${
              selectedFilter === "received"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Delivered
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            return (
              <div key={order.id} className="bg-white rounded overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-black opacity-50 uppercase tracking-wide mb-1">Order Placed</p>
                        <p className="text-sm font-medium text-black">
                          {new Date(order.created_at).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-black opacity-50 uppercase tracking-wide mb-1">Total</p>
                        <p className="text-lg font-bold text-black">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-black text-white px-4 py-1 text-xs font-mono font-bold inline-block mb-3">
                        ORDER #{order.id}
                      </div>
                      <p className="text-xs text-black opacity-60 cursor-pointer hover:opacity-100">View Details →</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className={`px-6 py-5 border-l-4 ${
                  order.status === "received" ? "border-black bg-gray-50" :
                  order.status === "dispatched" ? "border-black bg-gray-50" :
                  order.status === "processing" ? "border-black bg-gray-50" :
                  "border-gray-300 bg-gray-50"
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-base text-black mb-1">
                        {order.status === "received" && "Delivered"}
                        {order.status === "dispatched" && "Out for Delivery"}
                        {order.status === "processing" && "Processing"}
                        {order.status === "confirmed" && "Confirmed"}
                        {order.status === "pending" && "Pending"}
                      </p>
                      {order.status !== "received" && (
                        <p className="text-xs text-black opacity-60">
                          Estimated delivery: {getDeliveryDate(order)}
                        </p>
                      )}
                    </div>
                    {order.status === "dispatched" && (
                      <button className="px-5 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition">
                        Track Package
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="px-6 py-5 border-t border-gray-200">
                  <div className="space-y-4">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium text-black mb-1">{item.title || "Product"}</p>
                          <div className="flex gap-4 text-xs text-black opacity-60">
                            <span>Qty: {item.quantity}</span>
                            <span>₹{parseFloat(item.price).toFixed(2)} each</span>
                          </div>
                        </div>
                        <p className="font-bold text-black">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  {order.status === "received" && (
                    <button onClick={() => setInvoiceOrder(order)} style={{
                      marginTop: '16px',
                      padding: '10px 18px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                      📋 View Invoice
                    </button>
                  )}
                </div>

                {/* Collapsible Details */}
                <details className="border-t border-gray-200 group">
                  <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-black hover:bg-gray-50 transition flex justify-between items-center">
                    <span>View Shipment Details</span>
                    <span className="group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  
                  <div className="px-6 py-6 bg-gray-50 space-y-6">
                    {/* Timeline */}
                    <div>
                      <p className="text-xs font-bold text-black opacity-50 uppercase tracking-wide mb-4">Order Progress</p>
                      <div className="space-y-4">
                        {[
                          { stage: "confirmed", label: "Order Confirmed" },
                          { stage: "processing", label: "Processing" },
                          { stage: "dispatched", label: "Shipped" },
                          { stage: "received", label: "Delivered" }
                        ].map((step) => {
                          const isActive = ["confirmed", "processing", "dispatched", "received"].indexOf(order.status) >= 
                                         ["confirmed", "processing", "dispatched", "received"].indexOf(step.stage);
                          
                          return (
                            <div key={step.stage} className="flex items-start gap-4">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                                isActive ? "bg-black border-black text-white" : "border-gray-300 bg-white text-gray-300"
                              }`}>
                                {isActive && "✓"}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${isActive ? "text-black" : "text-black opacity-40"}`}>
                                  {step.label}
                                </p>
                                {isActive && (
                                  <p className="text-xs text-black opacity-50 mt-1">
                                    {new Date(order.created_at).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Address & Payment */}
                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                      {/* Address */}
                      {order.customer_info && (
                        <div>
                          <p className="text-xs font-bold text-black opacity-50 uppercase tracking-wide mb-3">Delivery Address</p>
                          <div className="text-sm text-black space-y-1">
                            <p className="font-medium">{order.customer_info.email}</p>
                            <p className="opacity-70">{order.customer_info.address}</p>
                            <p className="opacity-70">{order.customer_info.location}</p>
                            <p className="opacity-70">{order.customer_info.phone}</p>
                          </div>
                        </div>
                      )}

                      {/* Payment */}
                      <div>
                        <p className="text-xs font-bold text-black opacity-50 uppercase tracking-wide mb-3">Payment Method</p>
                        {order.payment_type === "offline" ? (
                          <div className="bg-red-600 text-white px-4 py-3 inline-block">
                            <p className="text-xs font-bold mb-1">CASH ON DELIVERY</p>
                            <p className="text-sm">Pay ₹{parseFloat(order.total_amount).toFixed(2)} to delivery partner</p>
                          </div>
                        ) : (
                          <div className="bg-black text-white px-4 py-3 inline-block">
                            <p className="text-xs font-bold mb-1">PAYMENT COMPLETED</p>
                            <p className="text-sm">₹{parseFloat(order.total_amount).toFixed(2)} paid online</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded p-16 text-center">
            <p className="text-lg font-semibold text-black mb-2">No orders found</p>
            <p className="text-sm text-black opacity-60">Try a different filter</p>
          </div>
        )}
      </div>
    </div>
  );
}