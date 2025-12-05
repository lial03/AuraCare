import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import './Dashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const moodToValue = (mood) => {
    switch (mood) {
        case 'Terrible': return 1;
        case 'Down': return 2;
        case 'Okay': return 3;
        case 'Good': return 4;
        case 'Amazing': return 5;
        case 'Mixed': return 3;
        default: return 3;
    }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [moodHistory, setMoodHistory] = useState([]);
  const [insights, setInsights] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Lina');

  const MIN_DATA_POINTS_FOR_INSIGHTS = 3; 
  const hasEnoughData = moodHistory.length >= MIN_DATA_POINTS_FOR_INSIGHTS && insights && insights.hasData;
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchAllData = async () => {
      if (!token) {
          setLoading(false);
          return;
      }
      
      const userId = localStorage.getItem('currentUserId');

      const fetchUserName = async (currentUserId) => {
          try {
              const profileResponse = await fetch(`${API_BASE_URL}/api/profile/${currentUserId}`, { 
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              const profileData = await profileResponse.json();
              if (profileResponse.ok) {
                  setUserName(profileData.fullName || 'User');
              }
          } catch (e) {
              console.error("Failed to fetch user name:", e);
          }
      };

      setLoading(true);
      
      if (userId) {
          fetchUserName(userId);
      }

      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        const [moodResponse, insightResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/moodhistory`, { headers }), 
            fetch(`${API_BASE_URL}/api/insights`, { headers }) 
        ]);
        
        const moodData = await moodResponse.json();
        const insightData = await insightResponse.json();
        
        if (moodResponse.ok && Array.isArray(moodData)) {
            const processedData = moodData.map(entry => ({
                date: new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: moodToValue(entry.mood),
                moodLabel: entry.mood,
            })).reverse(); 
            setMoodHistory(processedData);
        } else {
            setMoodHistory([]);
        }

        if (insightResponse.ok) {
            setInsights(insightData);
        } else {
            setInsights(null);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setMoodHistory([]);
        setInsights(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [token]);

  const handleSupportSignal = async () => {
      if (!token) {
          alert('Session expired. Please log in.');
          navigate('/login');
          return;
      }

      try {
          const response = await fetch(`${API_BASE_URL}/api/need-support`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          
          const data = await response.json();

          if (response.ok) {
              navigate('/help-on-way', { 
                  state: { 
                      contactReports: data.contactReports,
                      unverifiedContacts: data.unverifiedContacts || []
                  } 
              });
          } else if (response.status === 400 && data.message.includes('No contacts')) {
              alert('Please add contacts to your support circle before activating the signal.');
              navigate('/support-circle');
          } else {
              alert(`Failed to activate support signal: ${data.message || 'Server Error'}`);
          }
      } catch (error) {
          console.error('Network error activating support signal:', error);
          alert('Could not connect to the server or unexpected error.');
      }
  };
    
  const renderMoodChart = () => {
      if (loading) {
          return <div className="data-logged-card loading-card"><p>Loading mood data...</p></div>;
      }
      
      if (moodHistory.length === 0) {
          return (
              <div className="data-logged-card">
                  <p>No data logged</p>
              </div>
          );
      }

      return (
        <div className="mood-chart">
            <h2 className="chart-title-label">Your Mood Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={moodHistory} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                    
                    <XAxis dataKey="date" interval={0} tickLine={false} style={{ fontSize: '10px' }} stroke="#6B6B6B" />
                    
                    <YAxis 
                        domain={[1, 5]} 
                        ticks={[1, 2, 3, 4, 5]} 
                        tickFormatter={(value) => {
                            const labels = ['Terrible', 'Down', 'Okay/Mixed', 'Good', 'Amazing'];
                            if (value < 1 || value > 5) return ''; 
                            return labels[value - 1];
                        }}
                        tickLine={false}
                        axisLine={false}
                        style={{ fontSize: '10px' }}
                        stroke="#6B6B6B"
                    />
                    
                    <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div style={{ background: 'white', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '12px', color: '#2D2D2D' }}>
                                    <p style={{ margin: 0 }}>**Mood**: {payload[0].payload.moodLabel}</p>
                                    <p style={{ margin: 0 }}>**Date**: {payload[0].payload.date}</p>
                                </div>
                            );
                        }
                        return null;
                    }}/>
                    
                    <Line type="monotone" dataKey="value" stroke="#8B5FBF" strokeWidth={3} dot={{ fill: '#8B5FBF', r: 4 }} activeDot={{ r: 6 }}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
      );
  }

  return (
    <div className="dashboard-container">
      
      <div className="app-header">
        <h1 className="welcome-title">Hello {userName}! 👋</h1>
        <div className="time-avatar">{userName[0]}</div> 
      </div>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Link to="/mood-history" style={{ color: '#8B5FBF', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
              View All Mood History »
          </Link>
      </div>
      
      <div className="mood-section">
        {renderMoodChart()}
      </div>
      
      {/* Renders Insights ONLY if there is enough data */}
      {hasEnoughData && insights && insights.hasData && (
        <div className="insights-container" style={{ marginBottom: '40px' }}>
          <div className="insight-card-1">
            <span className="insight-icon">📈</span>
            <p className="insight-text">
              <span className="bold-label">Mood Status:</span>
              <br/>
              {insights.insightText}
            </p>
          </div>

          <div className="insight-card-2">
            <span className="insight-icon">🎯</span>
            <p className="insight-text">
              <span className="bold-label">Actionable Insight:</span>
              <br/>
              {insights.patternText}
            </p>
          </div>
          
          {/* Dynamic Action Button */}
          {insights.actionLink && (
            <Link to={insights.actionLink} className="support-button-link"> 
                <button 
                    className="support-button" 
                    style={{ 
                        backgroundColor: '#8B5FBF',
                        boxShadow: '0 6px 18px rgba(139, 95, 191, 0.5)',
                        marginTop: '15px'
                    }}
                >
                    Take Action Now »
                </button>
            </Link>
          )}
        </div>
      )}
      
      {/* Move the I Need Support Now button below the dynamic actions */}
      <div className="support-button-link" style={{ marginBottom: '40px', marginTop: hasEnoughData ? '0' : '20px' }}> 
        <button className="support-button" onClick={handleSupportSignal} style={{ 
          backgroundColor: '#FF6B8B', 
          boxShadow: '0 6px 18px rgba(255, 107, 139, 0.5)' 
        }}>
          🚨 I Need Support Now
        </button>
      </div>

      <h2 className="section-title">Quick Actions</h2>
      <div className="actions-grid">
        
        <Link to="/log-mood" className="action-link">
          <div className="action-card">
            <div className="action-icon">📝</div>
            <span className="action-text">Log My Mood</span>
          </div>
        </Link>
        
        <Link to="/support-circle" className="action-link">
          <div className="action-card">
            <div className="action-icon">👥</div>
            <span className="action-text">My Support Circle</span>
          </div>
        </Link>
        
        <Link to="/resources" className="action-link">
          <div className="action-card">
            <div className="action-icon">💡</div>
            <span className="action-text">Resources</span>
          </div>
        </Link>
        
        <Link to="/profile" className="action-link">
          <div className="action-card">
            <div className="action-icon">⚙️</div>
            <span className="action-text">My Profile</span>
          </div>
        </Link>
        
      </div>
    </div>
  );
};

export default Dashboard;