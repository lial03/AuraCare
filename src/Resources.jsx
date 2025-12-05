import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PageLayout.css';
import './Resources.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Resources = () => {
  // New state to store the AI's top resource recommendation tag
  const [highlightTag, setHighlightTag] = useState(null); 
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchAIContext = async () => {
      const userId = localStorage.getItem('currentUserId');
      const token = localStorage.getItem('authToken');
      
      if (!userId || !token) return;
      
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch User Name
        const profileResponse = await fetch(`${API_BASE_URL}/api/profile/${userId}`, { headers });
        const profileData = await profileResponse.json();
        if (profileResponse.ok) {
          setUserName(profileData.fullName || 'User');
        }

        // Fetch AI Insights to get the highlight tag
        const insightResponse = await fetch(`${API_BASE_URL}/api/insights`, { headers });
        const insightData = await insightResponse.json();
        
        // Use the tag returned by the AI (e.g., 'breathing', 'journaling')
        if (insightResponse.ok && insightData.hasData) {
          setHighlightTag(insightData.resourceHighlightTag);
        }
      } catch (error) {
        console.error('Error fetching resource context:', error);
      }
    };
    
    fetchAIContext();
  }, []);
  
  // Helper to apply the highlight style based on the AI tag
  const getHighlightStyle = (tag) => {
      if (highlightTag === tag) {
          return {
              border: '3px solid #FF6B8B',
              boxShadow: '0 6px 15px rgba(255, 107, 139, 0.4)'
          };
      }
      return {};
  };

  return (
    <div className="resources-container">
      <Link to="/dashboard" className="back-button-link">« Back to Dashboard</Link>
      <h1 className="page-title">💡 Well-being Resources</h1>

      {/* AI Tip Display */}
      {highlightTag && (
          <div className="content-card" style={{ marginBottom: '20px', backgroundColor: '#E8F5E9', borderLeft: '5px solid #4CAF50' }}>
              <p style={{ margin: '0', fontWeight: '600', color: '#4CAF50', fontSize: '15px' }}>
                  AI Tip: Based on your recent mood, we recommend focusing on <span style={{ textTransform: 'uppercase' }}>{highlightTag}</span> now.
              </p>
          </div>
      )}

      <div className="section-group">
        <h2 className="section-heading">🆘 Kenya Mental Health Emergency Contacts</h2>
        
        <div className="emergency-contacts-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '15px', 
          marginBottom: '20px' 
        }}>
          {/* Emergency Contact Cards - Static */}
          <div className="immediate-help-card" style={{ padding: '15px' }}>
            <p style={{ fontWeight: '700', fontSize: '16px', color: '#8B5FBF', marginBottom: '8px' }}>
              🚨 Kenya Red Cross Mental Health
            </p>
            <p className="helpline-number" style={{ fontSize: '20px', fontWeight: '700', color: '#2D2D2D' }}>
              1190 / 1199
            </p>
            <p className="helpline-note">24/7 Crisis Support</p>
          </div>

          <div className="immediate-help-card" style={{ padding: '15px' }}>
            <p style={{ fontWeight: '700', fontSize: '16px', color: '#8B5FBF', marginBottom: '8px' }}>
              💚 Befrienders Kenya
            </p>
            <p className="helpline-number" style={{ fontSize: '20px', fontWeight: '700', color: '#2D2D2D' }}>
              0722 178 177
            </p>
            <p className="helpline-note">7 AM - 7 PM Daily</p>
          </div>

          <div className="immediate-help-card" style={{ padding: '15px' }}>
            <p style={{ fontWeight: '700', fontSize: '16px', color: '#8B5FBF', marginBottom: '8px' }}>
              🏥 Chiromo Hospital Group
            </p>
            <p className="helpline-number" style={{ fontSize: '20px', fontWeight: '700', color: '#2D2D2D' }}>
              0800 220 000
            </p>
            <p className="helpline-note">24/7 Mental Health Support</p>
          </div>

          <div className="immediate-help-card" style={{ padding: '15px' }}>
            <p style={{ fontWeight: '700', fontSize: '16px', color: '#8B5FBF', marginBottom: '8px' }}>
              👶 Childline Kenya (Youth)
            </p>
            <p className="helpline-number" style={{ fontSize: '20px', fontWeight: '700', color: '#2D2D2D' }}>
              116
            </p>
            <p className="helpline-note">24/7 Toll-Free for Children</p>
          </div>

          <div className="immediate-help-card" style={{ padding: '15px' }}>
            <p style={{ fontWeight: '700', fontSize: '16px', color: '#8B5FBF', marginBottom: '8px' }}>
              🚔 Kenya Police Emergency
            </p>
            <p className="helpline-number" style={{ fontSize: '20px', fontWeight: '700', color: '#2D2D2D' }}>
              911 / 999 / 112
            </p>
            <p className="helpline-note">All Emergencies</p>
          </div>
        </div>

        <div className="content-card" style={{ marginTop: '15px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2D2D2D', marginBottom: '10px' }}>
            📞 More Support Services
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#2D2D2D' }}>
            <p><strong>Emergency Medicine Kenya:</strong> 0800 723 253</p>
            <p><strong>Niskize:</strong> 0900 620 800</p>
            <p><strong>Nacada (Substance Abuse):</strong> 1192 (24/7)</p>
            <p><strong>Gender Violence Recovery:</strong> 070 966 700 / 0800 720 565</p>
            <p><strong>Support Line Kenya:</strong> 254 20 3000378</p>
          </div>
        </div>

        <div className="content-card" style={{ marginTop: '15px', backgroundColor: '#FFF9E6', border: '2px solid #FFD700' }}>
          <p style={{ fontSize: '14px', color: '#2D2D2D', margin: '0', lineHeight: '1.6' }}>
            <strong>⚠️ Important:</strong> If you or someone you know is in immediate danger, please call <strong>911, 999, or 112</strong> for emergency services. These mental health hotlines provide free, confidential support 24/7. You are not alone.
          </p>
        </div>
      </div>

      <div className="section-group">
        <h2 className="section-heading">Quick Mood Boosters</h2>
        <div className="mood-booster-list">
          <Link to="/breathing-exercise" className="booster-link">
            {/* Apply highlight style if AI recommends 'breathing' */}
            <button className="booster-button breathing" style={getHighlightStyle('breathing')}>
              <span className="booster-icon">🌿</span> 5-Minute Breathing Exercise
            </button>
          </Link>
          <a href="https://www.youtube.com/watch?v=tck7E11SdR8" target="_blank" rel="noopener noreferrer" className="booster-link">
            {/* Apply highlight style if AI recommends 'music' */}
            <button className="booster-button music" style={getHighlightStyle('music')}>
              <span className="booster-icon">🎵</span> Calming Music Playlist
            </button>
          </a>
          <Link to="/resources/journaling" className="booster-link">
            {/* Apply highlight style if AI recommends 'journaling' */}
            <button className="booster-button journaling" style={getHighlightStyle('journaling')}>
              <span className="booster-icon">📓</span> Gratitude Journaling
            </button>
          </Link>
        </div>
      </div>

      <div className="section-group">
        <h2 className="section-heading">Educational Resources</h2>
        <p className="learn-more">Learn More</p>
        <div className="educational-list">
          <Link to="/resources/mental-health" className="booster-link">
            {/* Apply highlight style if AI recommends 'mental-health' */}
            <button className="edu-button mental-health" style={getHighlightStyle('mental-health')}>
              <span className="edu-icon">📚</span> Understanding Mental Health
            </button>
          </Link>
          <Link to="/resources/resilience" className="booster-link">
            {/* Apply highlight style if AI recommends 'resilience' */}
            <button className="edu-button resilience" style={getHighlightStyle('resilience')}>
              <span className="edu-icon">🎯</span> Building Resilience
            </button>
          </Link>
        </div>
      </div>

      <div className="section-group">
        <h2 className="section-heading">Your Wellness Journey</h2>
        <div className="mood-booster-list">
          <Link to="/journal-history" className="booster-link">
            <button className="booster-button journaling">
              <span className="booster-icon">📝</span> View Journal History
            </button>
          </Link>
          <Link to="/mood-history" className="booster-link">
            <button className="booster-button music">
              <span className="booster-icon">📊</span> View Mood History
            </button>
          </Link>
        </div>
      </div>

      <div className="button-group">
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary">Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default Resources;