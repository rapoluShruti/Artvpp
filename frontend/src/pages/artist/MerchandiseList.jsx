import { useState, useEffect } from "react";
import api from "../../api";

export default function MerchandiseList({ onSelectProduct, refreshTrigger }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/merchandise");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error loading products:", err);
      alert("Error loading products: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [refreshTrigger]);

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4">Your Merchandise Products</h3>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products yet. Create one to get started!</p>
      ) : (
        <div className="grid gap-4">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="border p-4 rounded cursor-pointer hover:bg-gray-100 bg-white"
            >
              <h4 className="font-bold text-lg">{product.title}</h4>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-sm text-gray-500">Variants: {product.variants?.filter(v => v.id).length || 0}</p>

              {product.variants && product.variants.filter(v => v.id).length > 0 && (
                <div className="mt-2 text-sm">
                  <p className="font-semibold">Variants:</p>
                  <ul className="ml-2">
                    {product.variants.map(v => (
                      v.id && <li key={v.id}>
                        {v.color} - {v.size} - ₹{v.price} ({v.quantity} qty)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
