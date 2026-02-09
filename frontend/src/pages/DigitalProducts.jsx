// import React, { useEffect, useState } from "react";
// import api from "../api";

// export default function DigitalProducts() {
//   const [loading, setLoading] = useState(true);
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;

//     async function loadDigitalItems() {
//       try {
//         const res = await api.get("/orders");
//         const orders = Array.isArray(res.data) ? res.data : [];

//         const collected = [];

//         for (const o of orders) {
//           try {
//             const od = await api.get(`/orders/${o.id}`);
//             const itemsList = od.data.items || [];
//             for (const it of itemsList) {
//               const isDigital = it.product_type === "digital" || it.is_digital || (it.title && /digital/i.test(it.title));
//               if (isDigital) {
//                 collected.push({
//                   ...it,
//                   orderId: o.id,
//                   orderDate: o.created_at || o.createdAt || null
//                 });
//               }
//             }
//           } catch (err) {
//             console.warn("Failed to fetch order detail", o.id, err.message);
//           }
//         }

//         if (mounted) setItems(collected);
//       } catch (err) {
//         if (mounted) setError(err.message || "Failed to load orders");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     loadDigitalItems();

//     return () => (mounted = false);
//   }, []);

//   if (loading) return <div>Loading digital products...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (items.length === 0)
//     return <div>No digital products found in your orders.</div>;

//   const fmtPrice = (v) => {
//     const n = Number(v);
//     return Number.isFinite(n) ? n.toFixed(2) : '-';
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Your Digital Products</h2>
//       <ul style={{ listStyle: "none", padding: 0 }}>
//         {items.map((it, idx) => (
//           <li key={idx} style={{ border: "1px solid #ddd", margin: "8px 0", padding: 12 }}>
//             <div style={{ fontWeight: 600 }}>{it.title || it.name || "Untitled"}</div>
//             <div>Quantity: {it.quantity || 1} • Price: {it.price != null ? `$${fmtPrice(it.price)}` : "-"}</div>
//             <div>Order: {it.orderId}</div>
//             <div>Order date: {it.orderDate || "-"}</div>
//             <div style={{ marginTop: 8 }}>
//               {it.product_id ? (
//                 <button
//                   onClick={async () => {
//                     try {
//                       const res = await api.get(`/digital/download/${it.product_id}`, { responseType: 'blob' });
//                       const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' });
//                       const url = window.URL.createObjectURL(blob);
//                       const a = document.createElement('a');
//                       const filename = (res.headers['content-disposition'] || '').split('filename=')[1] || `${it.title || 'download'}`;
//                       a.href = url;
//                       a.download = filename.replace(/"/g, '');
//                       document.body.appendChild(a);
//                       a.click();
//                       a.remove();
//                       window.URL.revokeObjectURL(url);
//                     } catch (err) {
//                       console.error('Download failed', err);
//                       alert(err.response?.data?.error || err.message || 'Download failed');
//                     }
//                   }}
//                   style={{ padding: "6px 10px", display: "inline-block", background: "#007bff", color: "#fff", textDecoration: "none", borderRadius: 4 }}
//                 >
//                   Download
//                 </button>
//               ) : (
//                 <button disabled style={{ padding: "6px 10px" }}>
//                   No download available
//                 </button>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import api from "../api";

export default function DigitalProducts() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadDigitalItems() {
      try {
        const res = await api.get("/orders");
        const orders = Array.isArray(res.data) ? res.data : [];

        const collected = [];

        for (const o of orders) {
          try {
            const od = await api.get(`/orders/${o.id}`);
            const itemsList = od.data.items || [];

            for (const it of itemsList) {
              const isDigital =
                it.product_type === "digital" ||
                it.is_digital ||
                (it.title && /digital/i.test(it.title));

              if (isDigital) {
                collected.push({
                  ...it,
                  orderId: o.id,
                  orderDate: o.created_at || o.createdAt || null
                });
              }
            }
          } catch (err) {
            console.warn("Failed to fetch order detail", o.id, err.message);
          }
        }

        if (mounted) setItems(collected);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDigitalItems();
    return () => (mounted = false);
  }, []);

  if (loading) return <p className="p-6">Loading digital products...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (items.length === 0)
    return <p className="p-6">No digital products found in your orders.</p>;

  const fmtPrice = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : "-";
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Heading */}
      <h2 className="text-2xl font-bold mb-6">
        Your Digital Products
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {items.map((it, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg transition"
          >

            {/* Info */}
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {it.title || it.name || "Untitled"}
              </h3>

              <p className="text-sm text-gray-600">
                Quantity: {it.quantity || 1}
              </p>

              <p className="text-sm text-gray-600">
                Price: {it.price != null ? `$${fmtPrice(it.price)}` : "-"}
              </p>

              <p className="text-sm text-gray-600">
                Order ID: {it.orderId}
              </p>

              <p className="text-sm text-gray-600">
                Order Date: {it.orderDate || "-"}
              </p>
            </div>

            {/* Action */}
            <div className="mt-4">
              {it.product_id ? (
                <button
                  onClick={async () => {
                    try {
                      const res = await api.get(
                        `/digital/download/${it.product_id}`,
                        { responseType: "blob" }
                      );

                      const blob = new Blob([res.data], {
                        type:
                          res.headers["content-type"] ||
                          "application/octet-stream"
                      });

                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      const filename =
                        (res.headers["content-disposition"] || "").split(
                          "filename="
                        )[1] || `${it.title || "download"}`;

                      a.href = url;
                      a.download = filename.replace(/"/g, "");
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      console.error("Download failed", err);
                      alert(
                        err.response?.data?.error ||
                          err.message ||
                          "Download failed"
                      );
                    }
                  }}
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition font-medium"
                >
                  Download
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-600 py-2 rounded-md cursor-not-allowed"
                >
                  No Download Available
                </button>
              )}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
