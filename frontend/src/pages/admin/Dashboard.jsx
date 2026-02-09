import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from "recharts";
import api from "../../api";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [artists, setArtists] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordRes, artRes, userRes] = await Promise.all([
          api.get("/orders"),
          api.get("/artist-profile"),
          api.get("/users"),
        ]);

        setOrders(ordRes.data || []);
        setArtists(artRes.data || []);
        setUsers(userRes.data || []);
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
        setOrders([]);
        setArtists([]);
        setUsers([]);
      }
    };

    fetchAll();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.total_amount || 0),
    0
  );

  // Orders per artist
  const byArtist = {};
  orders.forEach((o) => {
    const artistKey = o.artist_id || o.artistId || "unknown";
    byArtist[artistKey] = (byArtist[artistKey] || 0) + 1;
  });

  const barData = Object.entries(byArtist)
    .slice(0, 6)
    .map(([k, v]) => ({
      name: String(k).substring(0, 8),
      orders: v,
    }));

  const styles = {
    wrap: {
      padding: 24,
      background: "#e6f7ff",
      minHeight: "80vh",
      borderRadius: 12,
    },
    card: {
      background: "#fff",
      padding: 18,
      borderRadius: 12,
      boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
      color: "#000",
    },
    header: {
      fontSize: 22,
      fontWeight: 800,
      marginBottom: 8,
    },
  };

  return (
    <div style={styles.wrap}>
      <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <div style={{ ...styles.card, flex: 1 }}>
          <div style={styles.header}>Total Orders</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>
            {orders.length}
          </div>
        </div>

        <div style={{ ...styles.card, flex: 1 }}>
          <div style={styles.header}>Total Revenue</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>
            ${totalRevenue.toFixed(2)}
          </div>
        </div>

        <div style={{ ...styles.card, flex: 1 }}>
          <div style={styles.header}>Artists</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>
            {artists.length}
          </div>
        </div>

        <div style={{ ...styles.card, flex: 1 }}>
          <div style={styles.header}>Users</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>
            {users.length}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 18 }}>
        <div style={{ flex: 1, ...styles.card }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            Orders by Artist (Top)
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  barData.length
                    ? barData
                    : [{ name: "No data", orders: 0 }]
                }
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ width: 340, ...styles.card }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            Recent Orders
          </div>
          <div style={{ maxHeight: 260, overflow: "auto" }}>
            {orders.slice(0, 8).map((o) => (
              <div
                key={o.id}
                style={{
                  padding: 8,
                  borderBottom: "1px solid #f0f4f8",
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {String(o.id).substring(0, 8)} – ${o.total_amount}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {o.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
