import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../api'

export default function ArtistProfile() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtistProfile();
  }, [artistId]);

  const loadArtistProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/customer/artist/${artistId}`);
      setArtist(res.data.artist);
      setProducts(res.data.products || []);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Error loading artist:", err);
      alert("Artist not found");
      navigate("/browse");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (!artist) {
    return <div className="min-h-screen flex items-center justify-center"><p>Artist not found</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/browse")}
          className="text-blue-600 hover:underline mb-6"
        >
          ← Back to Browse
        </button>

        {/* Artist Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex gap-8 items-start">
            {/* Artist Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {artist.profile_image ? (
                  <img src={artist.profile_image} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-gray-400">👤</span>
                )}
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
              <p className="text-gray-600 mb-4 max-w-2xl">{artist.bio || "Artist bio not available"}</p>
              
              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-3 gap-8 mt-6 pt-6 border-t">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{stats.total_products || 0}</div>
                    <div className="text-gray-600">Products</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">{stats.total_sales || 0}</div>
                    <div className="text-gray-600">Sales</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      ₹{(stats.total_revenue || 0).toFixed(0)}
                    </div>
                    <div className="text-gray-600">Revenue</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Artist Products */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Artist's Works</h2>
          
          {products.length === 0 ? (
            <div className="bg-white p-12 rounded-lg text-center">
              <p className="text-gray-600 text-lg">No products from this artist yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold line-clamp-2 mb-3">{product.title}</h3>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {product.product_type}
                        </span>
                      </div>
                      {product.status && (
                        <span className="text-xs font-semibold text-green-700">
                          {product.status === 'active' ? '✓ Active' : 'Inactive'}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mt-3 pt-3 border-t">
                      {product.discount ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">
                            ₹{(product.price - product.discount).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
