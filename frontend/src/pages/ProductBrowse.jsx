// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import api from "../../api";

// // export default function ProductBrowse() {
// //   const navigate = useNavigate();
// //   const [products, setProducts] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   // Filter states
// //   const [selectedCategory, setSelectedCategory] = useState("");
// //   const [minPrice, setMinPrice] = useState("");
// //   const [maxPrice, setMaxPrice] = useState("");
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [productType, setProductType] = useState("");
// //   const [sortBy, setSortBy] = useState("newest");

// //   useEffect(() => {
// //     loadCategories();
// //   }, []);

// //   useEffect(() => {
// //     loadProducts();
// //   }, [selectedCategory, minPrice, maxPrice, searchTerm, productType, sortBy]);

// //   const loadCategories = async () => {
// //     try {
// //       const res = await api.get("/categories");
// //       setCategories(res.data || []);
// //     } catch (err) {
// //       console.error("Error loading categories:", err);
// //     }
// //   };

// //   const loadProducts = async () => {
// //     try {
// //       setLoading(true);
// //       const params = new URLSearchParams();
      
// //       if (selectedCategory) params.append("category", selectedCategory);
// //       if (minPrice) params.append("minPrice", minPrice);
// //       if (maxPrice) params.append("maxPrice", maxPrice);
// //       if (searchTerm) params.append("search", searchTerm);
// //       if (productType) params.append("productType", productType);
// //       if (sortBy) params.append("sortBy", sortBy);

// //       const res = await api.get(`/customer/products?${params}`);
// //       setProducts(res.data || []);
// //     } catch (err) {
// //       console.error("Error loading products:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleProductClick = (productId) => {
// //     navigate(`/product/${productId}`);
// //   };

// //   const calculateDiscountedPrice = (price, discount) => {
// //     if (!discount) return price;
// //     return price - discount;
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="max-w-7xl mx-auto px-4 py-8">
// //         <h1 className="text-4xl font-bold mb-8">Browse Art & Products</h1>

// //         {/* Search Bar */}
// //         <div className="mb-8">
// //           <input
// //             type="text"
// //             placeholder="Search products..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="w-full border rounded-lg p-3 text-lg"
// //           />
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
// //           {/* Sidebar Filters */}
// //           <div className="lg:col-span-1">
// //             <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
// //               <h2 className="text-xl font-bold mb-4">Filters</h2>

// //               {/* Category Filter */}
// //               <div className="mb-6">
// //                 <h3 className="font-semibold mb-3">Category</h3>
// //                 <select
// //                   value={selectedCategory}
// //                   onChange={(e) => setSelectedCategory(e.target.value)}
// //                   className="w-full border rounded p-2"
// //                 >
// //                   <option value="">All Categories</option>
// //                   {categories.map(cat => (
// //                     <option key={cat.id} value={cat.id}>{cat.name}</option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {/* Product Type Filter */}
// //               <div className="mb-6">
// //                 <h3 className="font-semibold mb-3">Product Type</h3>
// //                 <select
// //                   value={productType}
// //                   onChange={(e) => setProductType(e.target.value)}
// //                   className="w-full border rounded p-2"
// //                 >
// //                   <option value="">All Types</option>
// //                   <option value="physical_art">Physical Art</option>
// //                   <option value="merchandise">Merchandise</option>
// //                   <option value="digital">Digital</option>
// //                 </select>
// //               </div>

// //               {/* Price Filter */}
// //               <div className="mb-6">
// //                 <h3 className="font-semibold mb-3">Price Range</h3>
// //                 <div className="space-y-2">
// //                   <input
// //                     type="number"
// //                     placeholder="Min Price"
// //                     value={minPrice}
// //                     onChange={(e) => setMinPrice(e.target.value)}
// //                     className="w-full border rounded p-2"
// //                   />
// //                   <input
// //                     type="number"
// //                     placeholder="Max Price"
// //                     value={maxPrice}
// //                     onChange={(e) => setMaxPrice(e.target.value)}
// //                     className="w-full border rounded p-2"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Sort */}
// //               <div className="mb-6">
// //                 <h3 className="font-semibold mb-3">Sort By</h3>
// //                 <select
// //                   value={sortBy}
// //                   onChange={(e) => setSortBy(e.target.value)}
// //                   className="w-full border rounded p-2"
// //                 >
// //                   <option value="newest">Newest</option>
// //                   <option value="price-low">Price: Low to High</option>
// //                   <option value="price-high">Price: High to Low</option>
// //                   <option value="rating">Top Rated</option>
// //                 </select>
// //               </div>

// //               <button
// //                 onClick={() => {
// //                   setSelectedCategory("");
// //                   setMinPrice("");
// //                   setMaxPrice("");
// //                   setSearchTerm("");
// //                   setProductType("");
// //                   setSortBy("newest");
// //                 }}
// //                 className="w-full bg-gray-200 text-black p-2 rounded font-semibold hover:bg-gray-300"
// //               >
// //                 Clear Filters
// //               </button>
// //             </div>
// //           </div>

// //           {/* Products Grid */}
// //           <div className="lg:col-span-3">
// //             {loading ? (
// //               <div className="text-center py-12">
// //                 <p className="text-gray-500 text-lg">Loading products...</p>
// //               </div>
// //             ) : products.length === 0 ? (
// //               <div className="text-center py-12">
// //                 <p className="text-gray-500 text-lg">No products found</p>
// //               </div>
// //             ) : (
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                 {products.map(product => (
// //                   <div
// //                     key={product.id}
// //                     onClick={() => handleProductClick(product.id)}
// //                     className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
// //                   >
// //                     {/* Product Image */}
// //                     <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
// //                       {product.image ? (
// //                         <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
// //                       ) : (
// //                         <span className="text-gray-400">No Image</span>
// //                       )}
// //                     </div>

// //                     {/* Product Info */}
// //                     <div className="p-4">
// //                       <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.title}</h3>
                      
// //                       <div className="flex items-center justify-between mb-2">
// //                         <span className="text-sm text-gray-600">{product.artist_name}</span>
// //                         <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
// //                           {product.product_type}
// //                         </span>
// //                       </div>

// //                       {/* Price */}
// //                       <div className="mb-3">
// //                         {product.discount ? (
// //                           <div className="flex items-center gap-2">
// //                             <span className="text-2xl font-bold text-green-600">
// //                               ₹{calculateDiscountedPrice(product.price, product.discount).toFixed(2)}
// //                             </span>
// //                             <span className="text-lg text-gray-400 line-through">
// //                               ₹{parseFloat(product.price).toFixed(2)}
// //                             </span>
// //                             <span className="text-sm text-red-600 font-semibold">
// //                               {Math.round((parseFloat(product.discount) / parseFloat(product.price)) * 100)}% OFF
// //                             </span>
// //                           </div>
// //                         ) : (
// //                           <span className="text-2xl font-bold">₹{parseFloat(product.price).toFixed(2)}</span>
// //                         )}
// //                       </div>

// //                       {/* Rating */}
// //                       {product.avg_rating && (
// //                         <div className="flex items-center gap-1 text-sm">
// //                           <span className="text-yellow-500">★</span>
// //                           <span className="font-semibold">{product.avg_rating.toFixed(1)}</span>
// //                           <span className="text-gray-500">({product.review_count} reviews)</span>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api";

// export default function ProductBrowse() {

//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Filters
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [productType, setProductType] = useState("");
//   const [sortBy, setSortBy] = useState("newest");

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   useEffect(() => {
//     loadProducts();
//   }, [
//     selectedCategory,
//     minPrice,
//     maxPrice,
//     searchTerm,
//     productType,
//     sortBy,
//   ]);

//   const loadCategories = async () => {
//     try {
//       const res = await api.get("/categories");
//       setCategories(res.data || []);
//     } catch (err) {
//       console.error("Category error:", err);
//     }
//   };

//   const loadProducts = async () => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams();
//       if (selectedCategory) params.append("category", selectedCategory);
//       if (minPrice) params.append("minPrice", minPrice);
//       if (maxPrice) params.append("maxPrice", maxPrice);
//       if (searchTerm) params.append("search", searchTerm);
//       if (productType) params.append("productType", productType);
//       if (sortBy) params.append("sortBy", sortBy);

//       const res = await api.get(`/customer/products?${params}`);
//       setProducts(res.data || []);
//     } catch (err) {
//       console.error("Products error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProductClick = (id) => {
//     navigate(`/product/${id}`);
//   };

//   const calculateDiscountedPrice = (price, discount) => {
//     if (!discount) return price;
//     return price - discount;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* Header */}
//       <div className="max-w-7xl mx-auto px-4 py-10">
//         <h1 className="text-3xl font-semibold mb-6">
//           Browse Art & Products
//         </h1>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full md:w-96 border rounded-lg px-4 py-2 mb-8 focus:ring-2 focus:ring-black outline-none"
//         />

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

//           {/* FILTERS */}
//           <aside className="lg:col-span-1 space-y-6">

//             {/* Category */}
//             <div>
//               <p className="font-medium mb-1">Category</p>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full border rounded-lg p-2"
//               >
//                 <option value="">All</option>
//                 {categories.map(cat => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Type */}
//             <div>
//               <p className="font-medium mb-1">Product Type</p>
//               <select
//                 value={productType}
//                 onChange={(e) => setProductType(e.target.value)}
//                 className="w-full border rounded-lg p-2"
//               >
//                 <option value="">All</option>
//                 <option value="physical_art">Physical Art</option>
//                 <option value="merchandise">Merchandise</option>
//                 <option value="digital">Digital</option>
//               </select>
//             </div>

//             {/* Price */}
//             <div>
//               <p className="font-medium mb-1">Price</p>
//               <div className="flex gap-3">
//                 <input
//                   type="number"
//                   placeholder="Min"
//                   value={minPrice}
//                   onChange={(e) => setMinPrice(e.target.value)}
//                   className="w-full border rounded-lg p-2"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Max"
//                   value={maxPrice}
//                   onChange={(e) => setMaxPrice(e.target.value)}
//                   className="w-full border rounded-lg p-2"
//                 />
//               </div>
//             </div>

//             {/* Sort */}
//             <div>
//               <p className="font-medium mb-1">Sort</p>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="w-full border rounded-lg p-2"
//               >
//                 <option value="newest">Newest</option>
//                 <option value="price-low">Low → High</option>
//                 <option value="price-high">High → Low</option>
//                 <option value="rating">Top Rated</option>
//               </select>
//             </div>

//             {/* Clear */}
//             <button
//               onClick={() => {
//                 setSelectedCategory("");
//                 setMinPrice("");
//                 setMaxPrice("");
//                 setSearchTerm("");
//                 setProductType("");
//                 setSortBy("newest");
//               }}
//               className="text-sm underline"
//             >
//               Clear Filters
//             </button>

//           </aside>

//           {/* PRODUCTS */}
//           <section className="lg:col-span-3">

//             {loading ? (
//               <p className="text-gray-500">Loading...</p>
//             ) : products.length === 0 ? (
//               <p className="text-gray-500">No products found</p>
//             ) : (

//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

//                 {products.map(product => (
//                   <div
//                     key={product.id}
//                     onClick={() => handleProductClick(product.id)}
//                     className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
//                   >

//                     {/* Image */}
//                     <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
//                       {product.image ? (
//                         <img
//                           src={product.image}
//                           alt={product.title}
//                           className="w-full h-full object-cover hover:scale-105 transition"
//                         />
//                       ) : (
//                         <div className="h-full flex items-center justify-center text-gray-400">
//                           No Image
//                         </div>
//                       )}
//                     </div>

//                     {/* Info */}
//                     <div className="p-3">

//                       <p className="font-medium text-sm line-clamp-1">
//                         {product.title}
//                       </p>

//                       <p className="text-xs text-gray-500">
//                         {product.artist_name}
//                       </p>

//                       {product.discount ? (
//                         <div className="flex gap-2 mt-1 text-sm">
//                           <span className="font-semibold">
//                             ₹{calculateDiscountedPrice(
//                               product.price,
//                               product.discount
//                             ).toFixed(2)}
//                           </span>
//                           <span className="line-through text-gray-400">
//                             ₹{parseFloat(product.price).toFixed(2)}
//                           </span>
//                         </div>
//                       ) : (
//                         <p className="mt-1 font-semibold text-sm">
//                           ₹{parseFloat(product.price).toFixed(2)}
//                         </p>
//                       )}

//                     </div>

//                   </div>
//                 ))}

//               </div>

//             )}

//           </section>

//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ProductBrowse() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [productType, setProductType] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Mock data for demo - NOW WITH VIDEOS!
  const mockProducts = [
    { id: 1, title: "Abstract Canvas Art", artist_name: "by John Doe", price: 1299, discount: 0, image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400", product_type: "physical_art", avg_rating: 4.5, review_count: 24, height: 280 },
    { 
      id: 2, 
      title: "Artist at Work - Time Lapse", 
      artist_name: "by Sarah Miller", 
      price: 2499, 
      discount: 500, 
      video: "https://assets.mixkit.co/videos/preview/mixkit-person-drawing-a-portrait-on-a-canvas-50652-large.mp4", 
      thumbnail: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400", 
      product_type: "physical_art", 
      avg_rating: 4.8, 
      review_count: 45, 
      height: 320, 
      media_type: "video" 
    },
    { id: 3, title: "Colorful Abstract Print", artist_name: "by Alex Chen", price: 899, discount: 0, image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400", product_type: "physical_art", avg_rating: 4.3, review_count: 18, height: 380 },
    { 
      id: 4, 
      title: "Landscape Painting Demo", 
      artist_name: "by Emma Wilson", 
      price: 1599, 
      discount: 200, 
      video: "https://assets.mixkit.co/videos/preview/mixkit-painting-of-a-landscape-on-a-canvas-50651-large.mp4", 
      thumbnail: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400", 
      product_type: "physical_art", 
      avg_rating: 4.6, 
      review_count: 31, 
      height: 260, 
      media_type: "video" 
    },
    { id: 5, title: "Minimalist Frame Collection", artist_name: "by David Park", price: 1899, discount: 0, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", product_type: "physical_art", avg_rating: 4.7, review_count: 52, height: 300 },
    { id: 6, title: "Vintage Poster Set", artist_name: "by Lisa Anderson", price: 799, discount: 100, image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400", product_type: "merchandise", avg_rating: 4.4, review_count: 29, height: 340 },
    { 
      id: 7, 
      title: "Custom Art T-Shirt Preview", 
      artist_name: "by Michael Brown", 
      price: 599, 
      discount: 0, 
      video: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-in-white-t-shirt-and-jeans-41407-large.mp4", 
      thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", 
      product_type: "merchandise", 
      avg_rating: 4.2, 
      review_count: 67, 
      height: 280, 
      media_type: "video" 
    },
    { id: 8, title: "Designer Graphic Tee", artist_name: "by Amy Lee", price: 699, discount: 100, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400", product_type: "merchandise", avg_rating: 4.5, review_count: 43, height: 300 },
    { id: 9, title: "Framed Wall Art", artist_name: "by Robert Kim", price: 1399, discount: 0, image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400", product_type: "physical_art", avg_rating: 4.6, review_count: 36, height: 360 },
    { 
      id: 10, 
      title: "Drawing Process Video", 
      artist_name: "by Nina Patel", 
      price: 999, 
      discount: 150, 
      video: "https://assets.mixkit.co/videos/preview/mixkit-artist-drawing-on-a-canvas-50650-large.mp4", 
      thumbnail: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400", 
      product_type: "physical_art", 
      avg_rating: 4.7, 
      review_count: 28, 
      height: 320, 
      media_type: "video" 
    },
    { id: 11, title: "Colorful Wall Mural", artist_name: "by Chris Taylor", price: 3499, discount: 0, image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400", product_type: "physical_art", avg_rating: 4.9, review_count: 15, height: 280 },
    { id: 12, title: "Artistic Sticker Pack", artist_name: "by Jordan White", price: 299, discount: 50, image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400", product_type: "merchandise", avg_rating: 4.3, review_count: 89, height: 340 },
  ];

  const mockCategories = [
    { id: 1, name: "Paintings" },
    { id: 2, name: "Drawings" },
    { id: 3, name: "Photography" },
    { id: 4, name: "Digital Art" },
    { id: 5, name: "Sculptures" },
    { id: 6, name: "Prints" },
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, minPrice, maxPrice, searchTerm, productType, sortBy]);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data && res.data.length > 0 ? res.data : mockCategories);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories(mockCategories);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory) params.append("category", selectedCategory);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (searchTerm) params.append("search", searchTerm);
      if (productType) params.append("productType", productType);
      if (sortBy) params.append("sortBy", sortBy);

      const res = await api.get(`/customer/products?${params}`);
      
      // Map API products to include media_type based on video/image fields
      const apiProducts = res.data && res.data.length > 0 
        ? res.data.map(p => ({
            ...p,
            media_type: p.video ? 'video' : 'image',
            thumbnail: p.thumbnail || p.image
          }))
        : mockProducts;
      
      setProducts(apiProducts);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (productType) {
      filtered = filtered.filter(p => p.product_type === productType);
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    }

    return filtered;
  };

  const filteredProducts = filterProducts();

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{
        width: '240px',
        background: '#fff',
        borderRight: '1px solid #e0e0e0',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Logo/Brand */}
        <div style={{ padding: '0 20px', marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 800, 
            color: '#e60023',
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            Artinie Commerce
          </h2>
        </div>

        {/* Navigation Items */}
        <div style={{ marginBottom: '24px' }}>
          <NavItem icon="🏠" label="Home" active={false} onClick={() => navigate('/')} />
          <NavItem icon="🔍" label="Explore" active={true} onClick={() => {}} />
          <NavItem icon="📌" label="Create" active={false} onClick={() => navigate('/artist/manage-products')} />
        </div>

        {/* Categories */}
        <div style={{ padding: '0 20px', marginBottom: '24px' }}>
          <h3 style={{ 
            fontSize: '12px', 
            fontWeight: 700, 
            color: '#767676',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Categories
          </h3>
          {mockCategories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id.toString() ? "" : cat.id.toString())}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '4px',
                background: selectedCategory === cat.id.toString() ? '#e8f5e9' : 'transparent',
                color: selectedCategory === cat.id.toString() ? '#2e7d32' : '#333',
                fontWeight: selectedCategory === cat.id.toString() ? 600 : 400,
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat.id.toString()) {
                  e.target.style.background = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat.id.toString()) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {cat.name}
            </div>
          ))}
        </div>

        {/* Product Types */}
        <div style={{ padding: '0 20px', marginBottom: '24px' }}>
          <h3 style={{ 
            fontSize: '12px', 
            fontWeight: 700, 
            color: '#767676',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Type
          </h3>
          {['All', 'physical_art', 'merchandise', 'digital'].map(type => (
            <div
              key={type}
              onClick={() => setProductType(type === 'All' ? '' : type)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '4px',
                background: (type === 'All' && !productType) || productType === type ? '#e3f2fd' : 'transparent',
                color: (type === 'All' && !productType) || productType === type ? '#1976d2' : '#333',
                fontWeight: (type === 'All' && !productType) || productType === type ? 600 : 400,
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!((type === 'All' && !productType) || productType === type)) {
                  e.target.style.background = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!((type === 'All' && !productType) || productType === type)) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {type === 'All' ? 'All Types' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          ))}
        </div>

        {/* Clear Filters */}
        {(selectedCategory || productType || minPrice || maxPrice || searchTerm) && (
          <div style={{ padding: '0 20px' }}>
            <button
              onClick={() => {
                setSelectedCategory("");
                setMinPrice("");
                setMaxPrice("");
                setSearchTerm("");
                setProductType("");
                setSortBy("newest");
              }}
              style={{
                width: '100%',
                padding: '10px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#d32f2f'}
              onMouseLeave={(e) => e.target.style.background = '#f44336'}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Top Bar */}
        <div style={{
          padding: '16px 24px',
          background: '#fff',
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Search */}
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search for art, artists, styles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                border: 'none',
                borderRadius: '24px',
                background: '#f0f0f0',
                fontSize: '16px',
                outline: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '20px'
            }}>🔍</span>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '24px',
              background: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 500
            }}
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* User Actions */}
          <button style={{
            padding: '10px 20px',
            background: '#e60023',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Sign up
          </button>
        </div>

        {/* Products Masonry Grid */}
        <div style={{ padding: '24px' }}>
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px',
              color: '#999',
              fontSize: '18px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              Loading beautiful art...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px',
              color: '#999',
              fontSize: '18px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
              No products found. Try different filters!
            </div>
          ) : (
            <MasonryGrid products={filteredProducts} onProductClick={handleProductClick} />
          )}
        </div>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 20px',
        cursor: 'pointer',
        background: active ? '#f0f0f0' : 'transparent',
        borderRight: active ? '3px solid #e60023' : '3px solid transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.2s',
        fontWeight: active ? 600 : 400,
        fontSize: '15px'
      }}
      onMouseEnter={(e) => {
        if (!active) e.target.style.background = '#f5f5f5';
      }}
      onMouseLeave={(e) => {
        if (!active) e.target.style.background = 'transparent';
      }}
    >
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// Pinterest-style Masonry Grid
function MasonryGrid({ products, onProductClick }) {
  const columnCount = 4;
  const columns = Array.from({ length: columnCount }, () => []);

  // Distribute products into columns
  products.forEach((product, index) => {
    columns[index % columnCount].push(product);
  });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
      gap: '16px',
      maxWidth: '1600px',
      margin: '0 auto'
    }}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {column.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Product Card Component with VIDEO SUPPORT
function ProductCard({ product, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  
  const discountedPrice = product.discount ? product.price - product.discount : product.price;
  const discountPercent = product.discount ? Math.round((product.discount / product.price) * 100) : 0;

  const isVideo = product.media_type === 'video' && product.video;

  // Handle video playback on hover
  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(err => console.log('Video play failed:', err));
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsVideoPlaying(false);
      }
    }
  }, [isHovered, isVideo]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#fff',
        transition: 'all 0.3s',
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
      }}
    >
      {/* Media Container - Image or Video */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: product.height || '280px',
        background: '#f0f0f0',
        overflow: 'hidden'
      }}>
        {isVideo ? (
          <>
            {/* Video Element */}
            <video
              ref={videoRef}
              src={product.video}
              poster={product.thumbnail}
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            
            {/* Video Play Icon Overlay (shows when not playing) */}
            {!isVideoPlaying && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                pointerEvents: 'none',
                transition: 'opacity 0.3s',
                opacity: isHovered ? 0 : 1
              }}>
                ▶
              </div>
            )}

            {/* Video Badge */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(0,0,0,0.75)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🎥 VIDEO
            </div>
          </>
        ) : (
          /* Regular Image */
          product.image ? (
            <img
              src={product.image}
              alt={product.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '48px'
            }}>
              🎨
            </div>
          )
        )}

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#e60023',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(230,0,35,0.3)'
          }}>
            {discountPercent}% OFF
          </div>
        )}

        {/* Quick Actions (on hover) */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            gap: '8px'
          }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                alert('Added to wishlist!');
              }}
              style={{
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontSize: '16px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              ❤️
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                alert('Added to cart!');
              }}
              style={{
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontSize: '16px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              🛒
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ padding: '12px 16px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#333',
          marginBottom: '4px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4',
          margin: '0 0 4px 0'
        }}>
          {product.title}
        </h3>

        <p style={{
          fontSize: '12px',
          color: '#767676',
          marginBottom: '8px',
          margin: '0 0 8px 0'
        }}>
          {product.artist_name}
        </p>

        {/* Price */}
        <div style={{ marginBottom: '8px' }}>
          {product.discount > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#2e7d32'
              }}>
                ₹{discountedPrice}
              </span>
              <span style={{
                fontSize: '14px',
                color: '#999',
                textDecoration: 'line-through'
              }}>
                ₹{product.price}
              </span>
            </div>
          ) : (
            <span style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#333'
            }}>
              ₹{product.price}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.avg_rating && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px'
          }}>
            <span style={{ color: '#ffa000' }}>★</span>
            <span style={{ fontWeight: 600, color: '#333' }}>{product.avg_rating.toFixed(1)}</span>
            <span style={{ color: '#999' }}>({product.review_count})</span>
          </div>
        )}
      </div>
    </div>
  );
}