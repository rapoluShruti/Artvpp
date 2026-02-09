import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, totalDiscount: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCartItems(res.data.items || []);
      setTotals({
        subtotal: res.data.subtotal || 0,
        totalDiscount: res.data.totalDiscount || 0,
        total: res.data.total || 0
      });
    } catch (err) {
      console.error("Error loading cart:", err);
      alert("Error loading cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      await loadCart();
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Error removing item");
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      await api.put(`/cart/${cartItemId}`, { quantity: newQuantity });
      await loadCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Error updating quantity");
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await api.post("/orders", {});
      navigate(`/checkout/${res.data.orderId}`, {
        state: { totalAmount: res.data.totalAmount }
      });
    } catch (err) {
      console.error("Error creating order:", err);
      alert(err.response?.data?.error || "Error creating order");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center">
            <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate("/browse")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-gray-400">No Image</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.product_type}</p>
                      
                      {/* Price */}
                      <div className="mb-3">
                        {item.discount ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-600">
                              ₹{(parseFloat(item.price) - parseFloat(item.discount)).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{parseFloat(item.price).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold">₹{parseFloat(item.price).toFixed(2)}</span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border rounded w-fit">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 border-l border-r">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="flex flex-col justify-between items-end">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 font-semibold text-sm"
                      >
                        Remove
                      </button>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Subtotal</div>
                        <div className="font-bold text-lg">
                          ₹{(parseFloat(item.price) * item.quantity - (parseFloat(item.discount) || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow sticky top-8">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">-₹{totals.totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mb-6 text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600">₹{totals.total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 mb-2"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => navigate("/browse")}
                  className="w-full border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Continue Shopping
                </button>

                {/* Promo Code (Optional) */}
                <div className="mt-6 pt-6 border-t">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="w-full border rounded px-3 py-2 mb-2"
                  />
                  <button className="w-full bg-gray-200 py-2 rounded font-semibold hover:bg-gray-300">
                    Apply Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
