import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api";

export default function Checkout() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState("online"); // online or offline
  const [paymentMethod, setPaymentMethod] = useState("demo");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    phone: "",
    address: "",
    location: "",
  });
  const [errors, setErrors] = useState({});

  const totalAmount = location.state?.totalAmount || 0;

  useEffect(() => {
    loadOrderDetails();
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${orderId}`);
      setOrderDetails(res.data);
    } catch (err) {
      console.error("Error loading order:", err);
      alert("Order not found");
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    // Validate customer info
    if (!customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.location) {
      setErrors({ form: "Please fill in all required fields" });
      return;
    }

    if (paymentType === "offline") {
      await handleOfflinePayment();
    } else {
      if (paymentMethod === "razorpay") {
        handleRazorpayPayment();
      } else if (paymentMethod === "stripe") {
        handleStripePayment();
      } else if (paymentMethod === "demo") {
        handleDemoPayment();
      }
    }
  };

  const handleOfflinePayment = async () => {
    try {
      setProcessingPayment(true);

      // Save customer info and mark as pending payment
      const response = await api.post("/orders/payment", {
        orderId,
        paymentId: `OFFLINE_${Date.now()}`,
        paymentType: "offline",
        paymentMethod: "offline_delivery",
        customerInfo,
      });

      alert("✓ Order confirmed! You will make payment on delivery.");
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error("Error processing offline payment:", err);
      alert("Error confirming order. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setProcessingPayment(true);

      const options = {
        key: "YOUR_RAZORPAY_KEY", // Replace with actual key
        amount: totalAmount * 100, // Amount in paise
        currency: "INR",
        name: "KALAVPP",
        description: `Order #${orderId}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await api.post("/orders/payment", {
              orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
            alert("Payment successful!");
            navigate(`/order-confirmation/${orderId}`);
          } catch (err) {
            console.error("Error processing payment:", err);
            alert("Error processing payment");
          }
        },
        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error initiating Razorpay:", err);
      alert("Error initiating payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleStripePayment = async () => {
    alert("Stripe integration coming soon!");
  };

  const handleDemoPayment = async () => {
    try {
      setProcessingPayment(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await api.post("/orders/payment", {
        orderId,
        paymentId: `DEMO_${Date.now()}`,
        paymentType: "online",
        paymentMethod: "demo",
        customerInfo,
      });
      
      alert("Demo payment successful!");
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error("Error processing demo payment:", err);
      alert("Error processing payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            {orderDetails?.items && orderDetails.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b text-sm">
                <span>{item.title || "Product"} × {item.quantity}</span>
                <span>₹{parseFloat(item.price).toFixed(2)}</span>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t-2">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-green-600">₹{parseFloat(totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>

            {errors.form && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{errors.form}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  placeholder="Street, Building, Apartment"
                  className="w-full border rounded px-3 py-2 h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">City/Location *</label>
                <input
                  type="text"
                  value={customerInfo.location}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, location: e.target.value })}
                  placeholder="City, State, PIN"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

            {/* Payment Type Selection */}
            <div className="space-y-3 mb-6">
              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer" style={{ borderColor: paymentType === "online" ? "#2563eb" : "#e5e7eb" }}>
                <input
                  type="radio"
                  name="paymentType"
                  value="online"
                  checked={paymentType === "online"}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-bold text-sm">💳 Online Payment</div>
                  <div className="text-xs text-gray-600">Pay now with cards/UPI</div>
                </div>
              </label>

              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer" style={{ borderColor: paymentType === "offline" ? "#2563eb" : "#e5e7eb" }}>
                <input
                  type="radio"
                  name="paymentType"
                  value="offline"
                  checked={paymentType === "offline"}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-bold text-sm">🚚 Cash on Delivery</div>
                  <div className="text-xs text-gray-600">Pay at delivery</div>
                </div>
              </label>
            </div>

            {/* Online Payment Options */}
            {paymentType === "online" && (
              <div className="space-y-3 mb-6">
                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer" style={{ borderColor: paymentMethod === "demo" ? "#2563eb" : "#e5e7eb" }}>
                  <input
                    type="radio"
                    name="payment"
                    value="demo"
                    checked={paymentMethod === "demo"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm">Demo Payment</div>
                    <div className="text-xs text-gray-600">Test payment</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer opacity-50" style={{ borderColor: "#e5e7eb" }}>
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    disabled
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm">🎯 Razorpay (Coming)</div>
                    <div className="text-xs text-gray-600">Cards, UPI, Wallet</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer opacity-50" style={{ borderColor: "#e5e7eb" }}>
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    disabled
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm">💳 Stripe (Coming)</div>
                    <div className="text-xs text-gray-600">International cards</div>
                  </div>
                </label>
              </div>
            )}

            {paymentType === "online" && paymentMethod === "demo" && (
              <div className="bg-blue-50 p-3 rounded-lg mb-6 border border-blue-200 text-xs">
                <p className="text-blue-800"><strong>Demo:</strong> Any email, test card 4111 1111 1111 1111</p>
              </div>
            )}

            {paymentType === "offline" && (
              <div className="bg-green-50 p-3 rounded-lg mb-6 border border-green-200 text-xs">
                <p className="text-green-800">✓ Pay ₹{parseFloat(totalAmount).toFixed(2)} to delivery partner</p>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={processingPayment}
              className={`w-full py-3 rounded-lg font-bold text-white ${
                processingPayment
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {processingPayment ? "Processing..." : paymentType === "online" ? `Pay ₹${parseFloat(totalAmount).toFixed(2)}` : "Confirm Order"}
            </button>

            {/* Back Button */}
            <button
              onClick={() => navigate("/cart")}
              className="w-full mt-3 border-2 border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 text-sm"
            >
              Back to Cart
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <div className="flex gap-4">
            <div className="text-3xl">🔒</div>
            <div>
              <h3 className="font-bold mb-2">Your payment is secure</h3>
              <p className="text-gray-600 text-sm">
                All transactions are encrypted and secure. Your information is protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
