import { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Legend } from 'recharts';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [artists, setArtists] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchAll = async () => {
      try {
        const ord = await axios.get('http://localhost:5000/api/orders', { headers }).catch(() => ({ data: [] }));
        setOrders(ord.data || []);
      } catch (e) {
        setOrders([]);
      }

      try {
        const art = await axios.get('http://localhost:5000/api/artist-profile', { headers }).catch(() => ({ data: [] }));
        setArtists(art.data || []);
      } catch (e) {
        setArtists([]);
      }

      try {
        const us = await axios.get('http://localhost:5000/api/users', { headers }).catch(() => ({ data: [] }));
        setUsers(us.data || []);
      } catch (e) {
        setUsers([]);
      }
    };

    fetchAll();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.total_amount || 0), 0);

  // orders per artist
  const byArtist = {};
  orders.forEach(o => {
    const a = o.artist_id || o.artistId || 'unknown';
    byArtist[a] = (byArtist[a] || 0) + 1;
  });
  const barData = Object.entries(byArtist).slice(0,6).map(([k,v]) => ({ name: String(k).substring(0,8), orders: v }));

  const styles = {
    wrap: { padding: 24, background: '#e6f7ff', minHeight: '80vh', borderRadius: 12 },
    card: { background: '#fff', padding: 18, borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)', color: '#000' },
    header: { fontSize: 22, fontWeight: 800, marginBottom: 8 }
  };

  return (
    <div style={styles.wrap}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <div style={{ ...styles.card, flex: 1 }}>
          <div style={styles.header}>Total Orders</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{orders.length}</div>
        </div>
        <div style={{ ...styles.card, flex: 1 }}>
          <div style={styles.header}>Total Revenue</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>${totalRevenue.toFixed(2)}</div>
        </div>
        <div style={{ ...styles.card, flex: 1 }}>
          <div style={styles.header}>Artists</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{artists.length}</div>
        </div>
        <div style={{ ...styles.card, flex: 1 }}>
          <div style={styles.header}>Users</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{users.length}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
        <div style={{ flex: 1, ...styles.card }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Orders by Artist (top)</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData.length ? barData : [{ name: 'No data', orders: 0 }] }>
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
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Recent Orders</div>
          <div style={{ maxHeight: 260, overflow: 'auto' }}>
            {orders.slice(0,8).map(o => (
              <div key={o.id} style={{ padding: 8, borderBottom: '1px solid #f0f4f8' }}>
                <div style={{ fontWeight: 700 }}>{String(o.id).substring(0,8)} - ${o.total_amount}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{o.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
