import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 5000); // Redirect to orders page after 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Order Confirmed!</h1>
        <p className="text-gray-600 mb-2">Your order has been successfully placed.</p>
        <p className="text-sm text-gray-500 mb-6">Order ID: <span className="font-mono font-bold">{orderId}</span></p>

        {/* Details */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">✓</span> Order received and payment processed
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">✓</span> Confirmation email sent
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">✓</span> You can track your order in "My Orders"
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/browse")}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>

        {/* Auto-redirect message */}
        <p className="text-xs text-gray-500 mt-4">Redirecting to your orders in 5 seconds...</p>
      </div>
    </div>
  );
}
