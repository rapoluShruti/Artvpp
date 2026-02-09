import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api'; 

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
     const res = await api.get('/orders');

      setOrders(res.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: 20,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#e6f7ff',
      minHeight: '80vh',
      borderRadius: 12,
      paddingBottom: 80,
    },
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
    },
    subheader: {
      fontSize: 14,
      color: '#666',
      marginBottom: 24,
    },
    section: {
      marginBottom: 32,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 12,
      border: '1px solid #e6eef7',
      color: '#000'
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#333',
    },
    button: {
      padding: '12px 24px',
      borderRadius: 6,
      border: 'none',
      fontSize: 14,
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    primaryButton: {
      backgroundColor: '#2196f3',
      color: 'white',
    },
    card: {
      backgroundColor: 'white',
      border: '1px solid #eee',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      color: '#000'
    },
    flowStep: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    stepNumber: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      backgroundColor: '#2196f3',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      flexShrink: 0,
    },
    stepContent: {
      flex: 1,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 16,
      marginTop: 12,
    },
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  // derive chart data
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([k, v]) => ({ name: k, value: v }));
  const monthsMap = {};
  orders.forEach(o => {
    const d = new Date(o.created_at || o.createdAt || o.createdAtDate || Date.now());
    const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    monthsMap[key] = (monthsMap[key] || 0) + 1;
  });
  const barData = Object.entries(monthsMap).map(([k, v]) => ({ month: k, orders: v }));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        Customer Dashboard
      </div>
      <div style={styles.subheader}>Browse artists, commission work, and track your orders</div>

      {/* STEP 1: BROWSE */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>🎨 STEP 1: Browse & Discover Artists</div>
        
        <div style={styles.flowStep}>
          <div style={styles.stepNumber}>1</div>
          <div style={styles.stepContent}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Find Services You Love</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
              Browse thousands of commission services from talented artists. Filter by art style, type, and price range.
            </div>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={() => navigate('/browse')}
            >
              → Browse Services
            </button>
          </div>
        </div>
      </div>

      {/* STEP 2: ORDER */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>💰 STEP 2: Request a Commission</div>
        
        <div style={styles.flowStep}>
          <div style={styles.stepNumber}>2</div>
          <div style={styles.stepContent}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Select Package & Add-ons</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
              Click "Order Now" on any service. Choose your package size (Basic/Standard/Premium), add optional rush delivery or extra revisions, and proceed to checkout.
            </div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 8, fontStyle: 'italic' }}>
              💡 Tip: Check the artist's delivery time and revision policy before ordering
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: PAYMENT */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>🛡️ STEP 3: Secure Payment (Demo Mode)</div>
        
        <div style={styles.flowStep}>
          <div style={styles.stepNumber}>3</div>
          <div style={styles.stepContent}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Your Money is Protected</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
              Payment is held in escrow. Artist receives payment only after you accept the work. You can request revisions or reject if unsatisfied.
            </div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 8, fontStyle: 'italic' }}>
              📌 Current: Demo payment mode (no real charges)
            </div>
          </div>
        </div>
      </div>

      {/* STEP 4: PREVIEW & ACCEPT */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>👀 STEP 4: Review & Accept Work</div>
        
        <div style={styles.flowStep}>
          <div style={styles.stepNumber}>4</div>
          <div style={styles.stepContent}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Artist Uploads Preview</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
              Artist uploads preview/progress. You can request changes or accept the work. Once accepted, artist gets paid.
            </div>
          </div>
        </div>
      </div>

      {/* STEP 5: REVIEW */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>⭐ STEP 5: Rate & Review</div>
        
        <div style={styles.flowStep}>
          <div style={styles.stepNumber}>5</div>
          <div style={styles.stepContent}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Leave Feedback</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
              Rate your experience (1-5 stars) and leave a comment. Help other customers and support amazing artists!
            </div>
          </div>
        </div>
      </div>

      {/* MY ORDERS */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>📦 Your Orders ({orders.length})</div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px', ...styles.card }}>
            <div style={{ fontSize: 14, color: '#666' }}>Total Orders</div>
            <div style={{ fontSize: 26, fontWeight: '700' }}>{orders.length}</div>
          </div>
          <div style={{ flex: '1 1 260px', ...styles.card }}>
            <div style={{ fontSize: 14, color: '#666' }}>Total Spent</div>
            <div style={{ fontSize: 26, fontWeight: '700' }}>${orders.reduce((s, o) => s + (o.total_amount || 0), 0)}</div>
          </div>
          <div style={{ flex: '1 1 260px', ...styles.card }}>
            <div style={{ fontSize: 14, color: '#666' }}>Pending</div>
            <div style={{ fontSize: 26, fontWeight: '700' }}>{statusCounts['pending'] || statusCounts['escrow_pending'] || 0}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 18, alignItems: 'stretch' }}>
          <div style={{ flex: 1, height: 220, background: 'transparent' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData.length ? barData : [{ month: 'No data', orders: 0 }] }>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#60a5fa" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: 260, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData.length ? pieData : [{ name: 'none', value: 1 }]} dataKey="value" nameKey="name" outerRadius={80} innerRadius={36} label>
                  {(pieData.length ? pieData : [{ name: 'none', value: 1 }]).map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={["#60a5fa", "#4ade80", "#f59e0b", "#ef4444"][idx % 4]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          {orders.slice(0,5).map(ord => (
            <div key={ord.id} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Order #{String(ord.id).substring(0, 8)}</div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Amount: ${ord.total_amount}</div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>Status: <strong>{ord.status}</strong></div>
                </div>
                <button
                  style={{ ...styles.button, ...styles.primaryButton, fontSize: 12 }}
                  onClick={() => navigate(`/service/order/${ord.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACTION */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>🚀 Ready to Commission?</div>
        <button
          style={{ ...styles.button, ...styles.primaryButton, padding: '16px 32px', fontSize: 16 }}
          onClick={() => navigate('/browse')}
        >
          Browse Services Now →
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
