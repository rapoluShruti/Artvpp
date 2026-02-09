// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";

// export default function ProductDetail() {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [variants, setVariants] = useState([]);
//   const [media, setMedia] = useState([]);
//   const [similarProducts, setSimilarProducts] = useState([]);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

//   useEffect(() => {
//     loadProduct();
//   }, [productId]);

//   const loadProduct = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/customer/products/${productId}`);
//       console.log("📦 Product loaded:", res.data);
//       console.log("📹 Media items:", res.data.media);
//       console.log("🎨 Category:", res.data.product?.category_name);
//       setProduct(res.data.product);
//       setVariants(res.data.variants || []);
//       setMedia(res.data.media || []);
//       setSimilarProducts(res.data.similarProducts || []);
//     } catch (err) {
//       console.error("Error loading product:", err);
//       alert("Product not found");
//       navigate("/browse");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = async () => {
//     try {
//       if (!localStorage.getItem("token")) {
//         navigate("/login");
//         return;
//       }

//       await api.post("/cart", {
//         productId,
//         variantId: selectedVariant?.id,
//         quantity: parseInt(quantity)
//       });

//       alert("Added to cart!");
//     } catch (err) {
//       console.error("Error adding to cart:", err);
//       alert(err.response?.data?.error || "Error adding to cart");
//     }
//   };

//   const calculatePrice = (price, discount) => {
//     const p = price == null || price === "" ? 0 : parseFloat(price);
//     const d = discount == null || discount === "" ? 0 : parseFloat(discount);
//     if (!d) return p;
//     return p - d;
//   };

//   const toNum = (v, fallback = 0) => {
//     if (v == null || v === "") return fallback;
//     const n = parseFloat(v);
//     return Number.isFinite(n) ? n : fallback;
//   };

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
//   }

//   if (!product) {
//     return <div className="min-h-screen flex items-center justify-center"><p>Product not found</p></div>;
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <button
//           onClick={() => navigate("/browse")}
//           className="text-blue-600 hover:underline mb-6"
//         >
//           ← Back to Browse
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Product Images Gallery */}
//           <div className="bg-white p-6 rounded-lg">
//             <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg overflow-hidden mb-4">
//               {media && media.length > 0 ? (
//                 media[selectedMediaIndex]?.media_type === 'video' ? (
//                   <video 
//                     src={media[selectedMediaIndex].media_url} 
//                     controls 
//                     controlsList="nodownload"
//                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                   />
//                 ) : (
//                   <img 
//                     src={media[selectedMediaIndex]?.media_url} 
//                     alt={product.title} 
//                     className="w-full h-full object-cover" 
//                   />
//                 )
//               ) : (
//                 <span className="text-gray-400">No Image</span>
//               )}
//             </div>
            
//             {/* Thumbnails */}
//             {media && media.length > 1 && (
//               <div className="flex gap-2 overflow-x-auto">
//                 {media.map((item, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedMediaIndex(idx)}
//                     className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition relative ${
//                       selectedMediaIndex === idx
//                         ? "border-blue-600"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     {item?.media_type === 'video' ? (
//                       <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-2xl">
//                         ▶
//                       </div>
//                     ) : (
//                       <img 
//                         src={item?.media_url} 
//                         alt={`Thumbnail ${idx + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Details */}
//           <div className="space-y-6">
//             <div>
//               <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
//               <p className="text-gray-600">{product.description}</p>
//               {product.category_name && (
//                 <p className="text-sm text-gray-500 mt-3">
//                   <span className="inline-block bg-gray-100 px-3 py-1 rounded-full">📁 {product.category_name}</span>
//                 </p>
//               )}
//             </div>

//             {/* Artist Info */}
//             <div className="bg-white p-4 rounded-lg">
//               <p className="text-sm text-gray-600 mb-2">By Artist</p>
//               <div className="flex justify-between items-center">
//                 <h3 className="text-xl font-bold">{product.artist_name}</h3>
//                 <button
//                   onClick={() => navigate(`/artist/${product.artist_id}`)}
//                   className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
//                 >
//                   View Artist Profile
//                 </button>
//               </div>
//             </div>

//             {/* Price */}
//             <div className="bg-white p-6 rounded-lg">
//               {product.discount ? (
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-3">
//                     <span className="text-4xl font-bold text-green-600">
//                       ₹{toNum(calculatePrice(product.price, product.discount)).toFixed(2)}
//                     </span>
//                     <span className="text-2xl text-gray-400 line-through">
//                       ₹{toNum(product.price).toFixed(2)}
//                     </span>
//                   </div>
//                   <span className="text-red-600 font-bold text-lg">
//                     {product.discount ? `${Math.round((toNum(product.discount) / Math.max(1, toNum(product.price))) * 100)}% OFF` : null}
//                   </span>
//                 </div>
//               ) : (
//                 <span className="text-4xl font-bold">₹{toNum(product.price).toFixed(2)}</span>
//               )}
//             </div>

//             {/* Variants */}
//             {variants && variants.length > 0 && (
//               <div className="bg-white p-6 rounded-lg">
//                 <h3 className="font-bold text-lg mb-4">Select Variant</h3>
//                 <div className="space-y-3 max-h-96 overflow-y-auto">
//                   {variants.map(variant => (
//                     <div
//                       key={variant.id}
//                       onClick={() => setSelectedVariant(variant)}
//                       className={`p-4 border-2 rounded cursor-pointer transition flex gap-4 ${
//                         selectedVariant?.id === variant.id
//                           ? "border-blue-600 bg-blue-50"
//                           : "border-gray-200 hover:border-gray-300"
//                       }`}
//                     >
//                       {/* Variant Image */}
//                       {variant.image && (
//                         <img 
//                           src={variant.image} 
//                           alt="variant" 
//                           className="w-16 h-16 object-cover rounded"
//                         />
//                       )}
//                       {variant.preview_url && (
//                         <img 
//                           src={variant.preview_url} 
//                           alt="variant" 
//                           className="w-16 h-16 object-cover rounded"
//                         />
//                       )}
                      
//                       {/* Variant Details */}
//                       <div className="flex-1">
//                         <div className="font-semibold">
//                           {variant.color && `🎨 Color: ${variant.color}`}
//                           {variant.size && ` | 📏 Size: ${variant.size}`}
//                         </div>
//                         <div className="text-sm text-gray-600 mt-1">
//                           💰 Price: ₹{toNum(variant.price).toFixed(2)} | 📦 Stock: {variant.quantity || 0}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quantity & Add to Cart */}
//             <div className="bg-white p-6 rounded-lg">
//               <div className="flex items-center gap-4 mb-4">
//                 <label className="font-semibold">Quantity:</label>
//                 <div className="flex items-center border rounded">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="px-4 py-2 hover:bg-gray-100"
//                   >
//                     −
//                   </button>
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
//                     className="w-16 text-center border-none outline-none"
//                   />
//                   <button
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="px-4 py-2 hover:bg-gray-100"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//               <button
//                 onClick={handleAddToCart}
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700"
//               >
//                 Add to Cart
//               </button>
//             </div>

//             {/* Ratings */}
//             {product.avg_rating && (
//               <div className="bg-white p-6 rounded-lg">
//                 <div className="flex items-center gap-2">
//                   <span className="text-3xl text-yellow-500">★</span>
//                   <span className="text-2xl font-bold">{toNum(product.avg_rating).toFixed(1)}</span>
//                   <span className="text-gray-600">({product.review_count} reviews)</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Similar Products */}
//         {similarProducts.length > 0 && (
//           <div className="mt-16">
//             <h2 className="text-3xl font-bold mb-8">Similar Products</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {similarProducts.map(similar => (
//                 <div
//                   key={similar.id}
//                   onClick={() => navigate(`/product/${similar.id}`)}
//                   className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
//                 >
//                   <div className="bg-gray-200 h-40 flex items-center justify-center overflow-hidden rounded-t-lg">
//                     {similar.image ? (
//                       <img src={similar.image} alt={similar.title} className="w-full h-full object-cover" />
//                     ) : (
//                       <span className="text-gray-400">No Image</span>
//                     )}
//                   </div>
//                   <div className="p-4">
//                     <h4 className="font-bold line-clamp-2 mb-2">{similar.title}</h4>
//                     <p className="text-sm text-gray-600 mb-3">{similar.artist_name}</p>
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold text-lg">
//                         ₹{toNum(similar.price).toFixed(2)}
//                       </span>
//                       {similar.discount && (
//                         <span className="text-red-600 text-sm font-bold">
//                           -{Math.round((toNum(similar.discount) / Math.max(1, toNum(similar.price))) * 100)}%
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [media, setMedia] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/customer/products/${productId}`);
      setProduct(res.data.product);
      setVariants(res.data.variants || []);
      setMedia(res.data.media || []);
      setSimilarProducts(res.data.similarProducts || []);
    } catch (err) {
      console.error("Error loading product:", err);
      alert("Product not found");
      navigate("/browse");
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    
    // Switch to variant image if available
    if (variant.image || variant.preview_url) {
      const variantImageUrl = variant.image || variant.preview_url;
      const variantMediaIndex = media.findIndex(m => m.media_url === variantImageUrl);
      
      if (variantMediaIndex !== -1) {
        setSelectedMediaIndex(variantMediaIndex);
      } else {
        // Add variant image to media temporarily and select it
        const newMedia = [{ media_url: variantImageUrl, media_type: 'image' }, ...media];
        setMedia(newMedia);
        setSelectedMediaIndex(0);
      }
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }

      await api.post("/cart", {
        productId,
        variantId: selectedVariant?.id,
        quantity: parseInt(quantity)
      });

      alert("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.error || "Error adding to cart");
    }
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const calculatePrice = (price, discount) => {
    const p = price == null || price === "" ? 0 : parseFloat(price);
    const d = discount == null || discount === "" ? 0 : parseFloat(discount);
    if (!d) return p;
    return p - d;
  };

  const toNum = (v, fallback = 0) => {
    if (v == null || v === "") return fallback;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const currentPrice = selectedVariant?.price || product?.price;
  const currentDiscount = selectedVariant?.discount || product?.discount;
  const finalPrice = calculatePrice(currentPrice, currentDiscount);
  const discountPercentage = currentDiscount && currentPrice 
    ? Math.round((toNum(currentDiscount) / Math.max(1, toNum(currentPrice))) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate("/browse")} className="hover:text-blue-600 hover:underline">
              Products
            </button>
            {product.category_name && (
              <>
                <span>/</span>
                <span className="text-gray-900">{product.category_name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Section - Images */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg overflow-hidden sticky top-4">
              {/* Main Image with Zoom */}
              <div 
                className="relative bg-white border border-gray-200 overflow-hidden"
                style={{ aspectRatio: "1/1" }}
                onMouseEnter={() => media[selectedMediaIndex]?.media_type !== 'video' && setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                ref={imageRef}
              >
                {media && media.length > 0 ? (
                  media[selectedMediaIndex]?.media_type === 'video' ? (
                    <video 
                      src={media[selectedMediaIndex].media_url} 
                      controls 
                      controlsList="nodownload"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <img 
                        src={media[selectedMediaIndex]?.media_url} 
                        alt={product.title} 
                        className="w-full h-full object-contain transition-transform duration-200"
                        style={{
                          transform: isZooming ? 'scale(1.5)' : 'scale(1)',
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                        }}
                      />
                      {isZooming && (
                        <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                          Hover to zoom
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-lg">No Image Available</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {media && media.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto bg-white border-t border-gray-200">
                  {media.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMediaIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                        selectedMediaIndex === idx
                          ? "border-blue-600 shadow-md"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {item?.media_type === 'video' ? (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                          </svg>
                        </div>
                      ) : (
                        <img 
                          src={item?.media_url} 
                          alt={`View ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Product Details */}
          <div className="lg:col-span-5 space-y-4">
            {/* Title & Rating */}
            <div className="bg-white p-6 rounded-lg">
              <h1 className="text-2xl font-normal text-gray-900 mb-2">{product.title}</h1>
              
              {product.avg_rating && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-900">{toNum(product.avg_rating).toFixed(1)}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(toNum(product.avg_rating)) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                    {product.review_count} ratings
                  </span>
                </div>
              )}

              <div className="h-px bg-gray-200 my-4"></div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {currentDiscount ? (
                  <>
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-3xl font-normal text-red-700">₹{toNum(finalPrice).toFixed(2)}</span>
                    <span className="text-sm text-gray-500 line-through">₹{toNum(currentPrice).toFixed(2)}</span>
                    <span className="text-sm font-medium text-red-700">({discountPercentage}% off)</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-3xl font-normal text-gray-900">₹{toNum(currentPrice).toFixed(2)}</span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-4">{product.description}</p>
            </div>

            {/* Variants */}
            {variants && variants.length > 0 && (
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  {variants[0]?.color && "Color: "}
                  {variants[0]?.size && "Size: "}
                  <span className="font-normal text-gray-700">
                    {selectedVariant?.color || selectedVariant?.size || "Select an option"}
                  </span>
                </h3>
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      disabled={variant.quantity === 0}
                      className={`relative border-2 rounded-lg p-2 transition-all ${
                        selectedVariant?.id === variant.id
                          ? "border-blue-600 shadow-md"
                          : variant.quantity === 0
                          ? "border-gray-200 opacity-50 cursor-not-allowed"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {(variant.image || variant.preview_url) && (
                        <img 
                          src={variant.image || variant.preview_url} 
                          alt={variant.color || variant.size} 
                          className="w-full aspect-square object-cover rounded mb-1"
                        />
                      )}
                      <div className="text-xs text-center">
                        {variant.color && <div className="font-medium truncate">{variant.color}</div>}
                        {variant.size && <div className="text-gray-600 truncate">{variant.size}</div>}
                      </div>
                      {variant.quantity === 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                          <span className="text-xs font-medium text-red-600">Out of Stock</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Artist Info */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Artist</p>
                  <h3 className="text-lg font-medium text-gray-900">{product.artist_name}</h3>
                </div>
                <button
                  onClick={() => navigate(`/artist/${product.artist_id}`)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-900 block mb-2">Quantity:</label>
                <div className="flex items-center w-32 border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center border-x border-gray-300 py-2 outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-lg font-medium text-sm transition shadow-sm"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => navigate("/cart"), 500);
                }}
                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium text-sm transition shadow-sm"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            {product.category_name && (
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-gray-600 w-32">Category:</span>
                    <span className="text-gray-900">{product.category_name}</span>
                  </div>
                  {selectedVariant && (
                    <div className="flex">
                      <span className="text-gray-600 w-32">Available:</span>
                      <span className="text-gray-900">{selectedVariant.quantity} units</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-medium text-gray-900 mb-6 bg-white p-4 rounded-lg">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {similarProducts.map(similar => (
                <div
                  key={similar.id}
                  onClick={() => navigate(`/product/${similar.id}`)}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition cursor-pointer group"
                >
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                    {similar.image ? (
                      <img 
                        src={similar.image} 
                        alt={similar.title} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm line-clamp-2 mb-1 text-gray-900">{similar.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{similar.artist_name}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-base">
                        ₹{toNum(similar.price).toFixed(2)}
                      </span>
                      {similar.discount && (
                        <span className="text-xs text-red-600">
                          -{Math.round((toNum(similar.discount) / Math.max(1, toNum(similar.price))) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}