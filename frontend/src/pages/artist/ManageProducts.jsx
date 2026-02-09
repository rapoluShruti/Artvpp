import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/artist-products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error loading products:", err);
      alert("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (product) => {
    setEditingId(product.id);
    setEditForm({
      title: product.title,
      description: product.description,
      price: product.price,
      discount: product.discount || "",
      status: product.status
    });
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/artist-products/${editingId}`, {
        title: editForm.title,
        description: editForm.description,
        price: parseFloat(editForm.price),
        status: editForm.status
      });

      // Update discount separately if changed
      if (editForm.discount !== products.find(p => p.id === editingId).discount) {
        await api.put(`/artist-products/${editingId}/discount`, {
          discount: editForm.discount ? parseFloat(editForm.discount) : null
        });
      }

      alert("Product updated successfully!");
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert(err.response?.data?.error || "Error saving product");
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/artist-products/${productId}`);
      alert("Product deleted successfully!");
      await loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.response?.data?.error || "Error deleting product");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Products</h1>
          <button
            onClick={() => navigate("/artist/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
          >
            ← Back to Dashboard
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center">
            <p className="text-gray-600 text-lg mb-6">No products yet</p>
            <button
              onClick={() => navigate("/artist/dashboard")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Create Your First Product
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="bg-white p-6 rounded-lg shadow">
                {editingId === product.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Discount (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.discount}
                          onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
                          className="w-full border rounded p-2"
                          placeholder="Leave blank for no discount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Status</label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="w-full border rounded p-2"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full border rounded p-2 h-24"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-6 py-2 rounded font-semibold hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Product View
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-gray-400">No Image</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Price</span>
                          <div className="text-xl font-bold">₹{parseFloat(product.price).toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Discount</span>
                          <div className="text-xl font-bold text-green-600">
                            {product.discount ? `₹${parseFloat(product.discount).toFixed(2)}` : "—"}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Final Price</span>
                          <div className="text-xl font-bold">
                            ₹{(parseFloat(product.price) - (parseFloat(product.discount) || 0)).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Status</span>
                          <div className={`text-sm font-bold px-2 py-1 rounded w-fit ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status === 'active' ? '● Active' : '● Inactive'}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Type: {product.product_type} | Category: {product.category_name}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 justify-center">
                      <button
                        onClick={() => handleEditStart(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
