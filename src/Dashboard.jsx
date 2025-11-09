import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const moodToValue = (mood) => {
    switch (mood) {
        case 'Terrible': return 1;
        case 'Down': return 2;
        case 'Okay': return 3;
        case 'Good': return 4;
        case 'Amazing': return 5;
        default: return 3;
    }
};

const Dashboard = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [insights, setInsights] = useState(null); 
  const [loading, setLoading] = useState(true);

  const MIN_DATA_POINTS_FOR_INSIGHTS = 3; 
  const hasEnoughData = moodHistory.length >= MIN_DATA_POINTS_FOR_INSIGHTS && insights && insights.hasData;
  const token = localStorage.getItem('authToken');

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchAllData = async () => {
      if (!token) {
          setLoading(false);
          return;
      }
      
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        const [moodResponse, insightResponse] = await Promise.all([
            fetch('http://localhost:5000/api/moodhistory', { headers }),
            fetch('http://localhost:5000/api/insights', { headers })
        ]);
        
        const moodData = await moodResponse.json();
        const insightData = await insightResponse.json();
        
        // 1. Process Mood History (for Chart)
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

        // 2. Set Insights State (for Cards)
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
    
  // --- Chart/Placeholder Rendering Function ---
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
                <LineChart data={moodHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                    
                    <XAxis dataKey="date" interval={0} tickLine={false} style={{ fontSize: '10px' }} stroke="#6B6B6B" />
                    
                    <YAxis 
                        domain={[1, 5]} 
                        ticks={[1, 2, 3, 4, 5]} 
                        tickFormatter={(value) => {
                            const labels = ['Terrible', 'Down', 'Okay', 'Good', 'Amazing'];
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
        <h1 className="welcome-title">Hello Lina! 👋</h1>
        <div className="time-avatar">L</div> 
      </div>

      <div className="mood-section">
        {renderMoodChart()}
      </div>
      
      {hasEnoughData && insights && insights.hasData && (
        <div className="insights-container">
          <div className="insight-card-1">
            <span className="insight-icon">📈</span>
            <p className="insight-text">
              <span className="bold-label">This Week's Insight</span>
              <br/>
              {insights.insightText}
            </p>
          </div>

          <div className="insight-card-2">
            <span className="insight-icon">😜</span>
            <p className="insight-text">
              <span className="bold-label">Your Pattern:</span> {insights.patternText}
            </p>
          </div>
        </div>
      )}
      
      <Link to="/help-on-way" className="support-button-link">
        <button className="support-button">
          I Need Support Now
        </button>
      </Link>

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