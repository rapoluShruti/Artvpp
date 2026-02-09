import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ArtistDashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Mock Profile Data
  const profile = {
    id: 'artist_001',
    name: 'Sarah Anderson',
    email: 'sarah.anderson@artistry.com',
    specialty: 'Digital Art & Portrait Photography',
    joined: '2023-06-15',
    rating: 4.8,
    totalReviews: 127,
    avatar: '👩‍🎨'
  };

  // Mock Orders Data - More realistic
  const orders = [
    { id: 'ORD001', customer: 'John Smith', product: 'Canvas Print - Ocean Sunset', total_amount: 245, created_at: new Date(2025, 1, 1).toISOString(), status: 'completed', items: 1 },
    { id: 'ORD002', customer: 'Emma Wilson', product: 'Custom Portrait', total_amount: 380, created_at: new Date(2025, 1, 3).toISOString(), status: 'completed', items: 1 },
    { id: 'ORD003', customer: 'Michael Chen', product: 'Art Print Set (3pcs)', total_amount: 165, created_at: new Date(2025, 1, 5).toISOString(), status: 'processing', items: 3 },
    { id: 'ORD004', customer: 'Sophie Davis', product: 'Digital Illustration', total_amount: 420, created_at: new Date(2025, 1, 7).toISOString(), status: 'completed', items: 1 },
    { id: 'ORD005', customer: 'James Brown', product: 'Wedding Portrait Package', total_amount: 890, created_at: new Date(2025, 1, 8).toISOString(), status: 'completed', items: 5 },
    { id: 'ORD006', customer: 'Olivia Martin', product: 'Pet Portrait', total_amount: 195, created_at: new Date(2025, 1, 9).toISOString(), status: 'pending', items: 1 },
    { id: 'ORD007', customer: 'Daniel Lee', product: 'Abstract Art Print', total_amount: 125, created_at: new Date(2025, 0, 28).toISOString(), status: 'completed', items: 1 },
    { id: 'ORD008', customer: 'Isabella Garcia', product: 'Family Portrait Session', total_amount: 650, created_at: new Date(2025, 0, 25).toISOString(), status: 'completed', items: 1 },
    { id: 'ORD009', customer: 'Ryan Taylor', product: 'Logo Design', total_amount: 340, created_at: new Date(2025, 0, 20).toISOString(), status: 'completed', items: 1 },
    { id: 'ORD010', customer: 'Ava Anderson', product: 'Custom Watercolor', total_amount: 280, created_at: new Date(2025, 0, 15).toISOString(), status: 'completed', items: 1 },
  ];

  // Mock Bookings/Services Data - Scheduled across different dates
  const bookings = [
    { 
      id: 'BK001', 
      service_title: 'Portrait Photography Session', 
      client_name: 'Lisa Johnson',
      scheduled_date: new Date(2025, 1, 9).toISOString(), 
      scheduled_time: '10:00 AM',
      duration: '2 hours',
      location: 'Downtown Studio',
      status: 'confirmed',
      price: 450,
      notes: 'Outdoor preferred if weather permits'
    },
    { 
      id: 'BK002', 
      service_title: 'Logo Design Consultation', 
      client_name: 'Tech Startup Inc.',
      scheduled_date: new Date(2025, 1, 9).toISOString(), 
      scheduled_time: '02:00 PM',
      duration: '1.5 hours',
      location: 'Virtual Meeting',
      status: 'confirmed',
      price: 200,
      notes: 'Prepare mood board examples'
    },
    { 
      id: 'BK003', 
      service_title: 'Wedding Photography', 
      client_name: 'Emily & Mark',
      scheduled_date: new Date(2025, 1, 14).toISOString(), 
      scheduled_time: '03:00 PM',
      duration: '6 hours',
      location: 'Garden Venue',
      status: 'confirmed',
      price: 1500,
      notes: 'Full day coverage with assistant'
    },
    { 
      id: 'BK004', 
      service_title: 'Art Workshop', 
      client_name: 'Community Center',
      scheduled_date: new Date(2025, 1, 16).toISOString(), 
      scheduled_time: '11:00 AM',
      duration: '3 hours',
      location: 'Main Street Center',
      status: 'pending',
      price: 350,
      notes: 'Beginner-friendly watercolor techniques'
    },
    { 
      id: 'BK005', 
      service_title: 'Product Photography', 
      client_name: 'Fashion Boutique',
      scheduled_date: new Date(2025, 1, 20).toISOString(), 
      scheduled_time: '09:00 AM',
      duration: '4 hours',
      location: 'Client Location',
      status: 'confirmed',
      price: 600,
      notes: 'New collection shoot - 50 items'
    },
    { 
      id: 'BK006', 
      service_title: 'Portrait Editing Session', 
      client_name: 'Corporate Client',
      scheduled_date: new Date(2025, 1, 9).toISOString(), 
      scheduled_time: '04:30 PM',
      duration: '1 hour',
      location: 'Virtual',
      status: 'pending',
      price: 150,
      notes: 'Review and select final edits'
    },
  ];

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const todayEnd = todayStart + (24 * 60 * 60 * 1000);

  const deliveredToday = orders.filter(o => {
    const orderDate = new Date(o.created_at);
    return orderDate.getTime() >= todayStart && orderDate.getTime() < todayEnd && o.status === 'completed';
  }).length;

  const pendingConfirmations = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

  // Get bookings for selected date
  const getBookingsForDate = (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const targetTime = targetDate.getTime();
    
    return bookings.filter(b => {
      const bookingDate = new Date(b.scheduled_date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === targetTime;
    });
  };

  const selectedDateBookings = getBookingsForDate(selectedDate);

  // Check if date has bookings
  const hasBookings = (date) => {
    return getBookingsForDate(date).length > 0;
  };

  // Revenue by month
  const monthlyRevenue = [
    { month: 'Sep', revenue: 2450, orders: 12 },
    { month: 'Oct', revenue: 3200, orders: 18 },
    { month: 'Nov', revenue: 2890, orders: 15 },
    { month: 'Dec', revenue: 4100, orders: 22 },
    { month: 'Jan', revenue: 3690, orders: 19 },
    { month: 'Feb', revenue: totalRevenue, orders: orders.length },
  ];

  // Order status distribution
  const statusData = [
    { name: 'Completed', value: completedOrders, color: '#10b981' },
    { name: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: '#f59e0b' },
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#ef4444' },
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Previous month's days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ 
        date, 
        day: i, 
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
        hasBookings: hasBookings(date)
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const shareBookingLink = () => {
    const link = `https://artistry-platform.com/book/${profile.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const styles = {
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: 0, margin: 0 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        
        {/* Header with Profile */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              {profile.avatar}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#333', margin: 0 }}>{profile.name}</h1>
              <p style={{ color: '#666', margin: '4px 0 0 0', fontSize: '14px' }}>{profile.specialty}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ color: '#f59e0b' }}>⭐</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>{profile.rating}</span>
                <span style={{ fontSize: '12px', color: '#999' }}>({profile.totalReviews} reviews)</span>
              </div>
            </div>
          </div>
          <button onClick={() => setShowShareModal(true)} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s'
          }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
            🔗 Share Booking Link
          </button>
        </div>

        {/* Top Section: Greeting + Calendar */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {/* Greeting Card */}
          <div style={{
            flex: '1',
            minWidth: '320px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '32px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
          }}>
            <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 600, marginBottom: '4px' }}>
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', lineHeight: '1.2', margin: '8px 0 16px 0' }}>
              {getGreeting()}, {profile.name.split(' ')[0]}! 👋
            </h2>
            <p style={{ fontSize: '16px', opacity: 0.95, marginBottom: '24px', fontWeight: 500, margin: '0 0 24px 0' }}>
              Your total earning is <strong style={{ fontSize: '22px' }}>${totalRevenue.toLocaleString()}</strong> with <strong>{orders.length} orders</strong> completed this month
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/artist/analytics')} style={{
                background: 'white',
                color: '#667eea',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}>
                📊 View Analytics
              </button>
              <button onClick={() => navigate('/artist/orders')} style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}>
                📦 All Orders
              </button>
            </div>
          </div>

          {/* Enhanced Calendar */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            minWidth: '380px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#333', margin: 0 }}>
                📅 {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))} style={{
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}>←</button>
                <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))} style={{
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}>→</button>
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '8px'
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} style={{ 
                  textAlign: 'center', 
                  padding: '8px', 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  color: '#666' 
                }}>{d}</div>
              ))}
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px'
            }}>
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                  style={{
                    textAlign: 'center',
                    padding: '10px 8px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: day.isToday ? 700 : 500,
                    color: !day.isCurrentMonth ? '#ccc' : day.isToday ? '#667eea' : '#333',
                    background: day.isSelected ? '#667eea' : day.isToday ? '#e8ecff' : day.hasBookings ? '#fff3e0' : 'transparent',
                    cursor: day.isCurrentMonth ? 'pointer' : 'default',
                    position: 'relative',
                    transition: 'all 0.2s',
                    border: day.isSelected ? '2px solid #667eea' : '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (day.isCurrentMonth && !day.isSelected) {
                      e.target.style.background = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (day.isCurrentMonth && !day.isSelected) {
                      e.target.style.background = day.hasBookings ? '#fff3e0' : 'transparent';
                    }
                  }}
                >
                  {day.day || ''}
                  {day.hasBookings && !day.isSelected && (
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: '#f59e0b'
                    }}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Date Bookings */}
            {selectedDateBookings.length > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                borderRadius: '12px',
                border: '2px solid #667eea30'
              }}>
                <div style={{ 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  color: '#667eea', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📅</span>
                  {selectedDateBookings.length} Service{selectedDateBookings.length !== 1 ? 's' : ''} on {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                {selectedDateBookings.map((booking, idx) => (
                  <div key={idx} style={{ 
                    background: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: idx < selectedDateBookings.length - 1 ? '8px' : 0,
                    border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: 700, 
                      color: '#333',
                      marginBottom: '4px'
                    }}>
                      {booking.service_title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
                      🕐 {booking.scheduled_time} • {booking.duration}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
                      👤 {booking.client_name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      📍 {booking.location}
                    </div>
                    <div style={{
                      marginTop: '8px',
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      background: booking.status === 'confirmed' ? '#e8f5e9' : '#fff3e0',
                      color: booking.status === 'confirmed' ? '#388e3c' : '#f57c00'
                    }}>
                      {booking.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedDateBookings.length === 0 && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                textAlign: 'center',
                color: '#999',
                fontSize: '13px',
                background: '#f9f9f9',
                borderRadius: '8px'
              }}>
                No services scheduled on this date
              </div>
            )}
          </div>
        </div>

        {/* Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Total Orders</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#333' }}>{orders.length}</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '8px', fontWeight: 600 }}>↗ +12.5% from last month</div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Completed Orders</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981' }}>{completedOrders}</div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Successfully delivered</div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Pending Orders</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>{pendingOrders}</div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Awaiting action</div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Total Revenue</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#667eea' }}>${totalRevenue.toLocaleString()}</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '8px', fontWeight: 600 }}>↗ +18% growth</div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Confirmed Bookings</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981' }}>{confirmedBookings}</div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Upcoming services</div>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Pending Confirmations</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>{pendingConfirmations}</div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Needs response</div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {/* Revenue Chart */}
          <div style={{
            flex: '2',
            minWidth: '400px',
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '16px', margin: '0 0 16px 0' }}>
              📈 Revenue Trend (Last 6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" style={{ fontSize: '12px' }} />
                <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '12px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={3} dot={{ fill: '#667eea', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Pie Chart */}
          <div style={{
            flex: '1',
            minWidth: '300px',
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '16px', margin: '0 0 16px 0' }}>
              📊 Order Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders & Upcoming Services */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* Recent Orders */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '16px', margin: '0 0 16px 0' }}>
              📦 Recent Orders
            </h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {orders.slice(0, 5).map((order, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>{order.product}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {order.customer} • {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      background: order.status === 'completed' ? '#e8f5e9' : order.status === 'processing' ? '#fff3e0' : '#fee',
                      color: order.status === 'completed' ? '#388e3c' : order.status === 'processing' ? '#f57c00' : '#d32f2f'
                    }}>
                      {order.status.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#667eea' }}>
                    ${order.total_amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Services */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '16px', margin: '0 0 16px 0' }}>
              🗓️ Upcoming Services
            </h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {bookings
                .filter(b => new Date(b.scheduled_date) >= today)
                .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
                .slice(0, 5)
                .map((booking, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>{booking.service_title}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        👤 {booking.client_name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        📍 {booking.location}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      background: booking.status === 'confirmed' ? '#e8f5e9' : '#fff3e0',
                      color: booking.status === 'confirmed' ? '#388e3c' : '#f57c00'
                    }}>
                      {booking.status.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    <span>📅 {new Date(booking.scheduled_date).toLocaleDateString()}</span>
                    <span>🕐 {booking.scheduled_time}</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#667eea', marginTop: '8px' }}>
                    ${booking.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <button onClick={() => navigate('/artist/manage-products')} style={{
            background: 'white',
            border: '2px solid #667eea',
            color: '#667eea',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s'
          }} onMouseEnter={(e) => { e.target.style.background = '#667eea'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#667eea'; }}>
            ➕ Add Product
          </button>

          <button onClick={() => navigate('/artist/manage-services')} style={{
            background: 'white',
            border: '2px solid #764ba2',
            color: '#764ba2',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s'
          }} onMouseEnter={(e) => { e.target.style.background = '#764ba2'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#764ba2'; }}>
            💼 Manage Services
          </button>

          <button onClick={() => navigate('/artist/onboarding')} style={{
            background: 'white',
            border: '2px solid #10b981',
            color: '#10b981',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s'
          }} onMouseEnter={(e) => { e.target.style.background = '#10b981'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#10b981'; }}>
            📋 Edit Profile
          </button>

          <button onClick={() => navigate('/artist/orders')} style={{
            background: 'white',
            border: '2px solid #f59e0b',
            color: '#f59e0b',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s'
          }} onMouseEnter={(e) => { e.target.style.background = '#f59e0b'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#f59e0b'; }}>
            📦 All Orders
          </button>

          <button onClick={() => navigate('/artist/bookings')} style={{
            background: 'white',
            border: '2px solid #ec4899',
            color: '#ec4899',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s'
          }} onMouseEnter={(e) => { e.target.style.background = '#ec4899'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#ec4899'; }}>
            🗓️ My Bookings
          </button>

          <button onClick={() => navigate('/artist/analytics')} style={{
            background: 'white',
            border: '2px solid #06b6d4',
            color: '#06b6d4',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s'
          }} onMouseEnter={(e) => { e.target.style.background = '#06b6d4'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#06b6d4'; }}>
            📊 Analytics
          </button>
        </div>
      </div>

      {/* Share Booking Link Modal */}
      {showShareModal && (
        <div style={styles.modal} onClick={() => setShowShareModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: '#333', margin: '0 0 16px 0' }}>
              🔗 Share Your Booking Link
            </h2>
            <p style={{ color: '#666', marginBottom: '24px', margin: '0 0 24px 0' }}>
              Share this link with clients so they can book your services directly!
            </p>
            
            <div style={{
              background: '#f9f9f9',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '2px dashed #667eea',
              wordBreak: 'break-all'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#667eea' }}>
                https://artistry-platform.com/book/{profile.id}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={shareBookingLink} style={{
                flex: 1,
                background: copiedLink ? '#10b981' : '#667eea',
                color: 'white',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}>
                {copiedLink ? '✓ Link Copied!' : '📋 Copy Link'}
              </button>
              
              <button onClick={() => window.open(`https://wa.me/?text=Book my services: https://artistry-platform.com/book/${profile.id}`, '_blank')} style={{
                background: '#25D366',
                color: 'white',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                💬 WhatsApp
              </button>

              <button onClick={() => window.open(`mailto:?subject=Book my services&body=Check out my services: https://artistry-platform.com/book/${profile.id}`, '_blank')} style={{
                background: '#EA4335',
                color: 'white',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                📧 Email
              </button>
            </div>

            <button onClick={() => setShowShareModal(false)} style={{
              width: '100%',
              marginTop: '16px',
              background: '#f0f0f0',
              color: '#333',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;