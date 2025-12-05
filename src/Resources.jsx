import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PageLayout.css';
import './Resources.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Resources = () => {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchUserName = async () => {
      const userId = localStorage.getItem('currentUserId');
      const token = localStorage.getItem('authToken');
      
      if (!userId || !token) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setUserName(data.fullName || 'User');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };
    
    fetchUserName();
  }, []);

  return (
    <div className="resources-container">
      <Link to="/dashboard" className="back-button-link">« Back to Dashboard</Link>
      <h1 className="page-title">💡 Well-being Resources</h1>

      <div className="section-group">
        <h2 className="section-heading">Immediate Help</h2>
        <div className="immediate-help-card">
          <p className="helpline-number">Crisis Helpline: 1-800-273-8255</p>
          <p className="helpline-note">Available 24/7 - You're not alone</p>
        </div>
      </div>

      <div className="section-group">
        <h2 className="section-heading">Quick Mood Boosters</h2>
        <div className="mood-booster-list">
          <Link to="/breathing-exercise" className="booster-link">
            <button className="booster-button breathing">
              <span className="booster-icon">🌿</span> 5-Minute Breathing Exercise
            </button>
          </Link>
          <a href="https://www.youtube.com/watch?v=tck7E11SdR8" target="_blank" rel="noopener noreferrer" className="booster-link">
            <button className="booster-button music">
              <span className="booster-icon">🎵</span> Calming Music Playlist
            </button>
          </a>
          <Link to="/resources/journaling" className="booster-link">
            <button className="booster-button journaling">
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
            <button className="edu-button mental-health">
              <span className="edu-icon">📚</span> Understanding Mental Health
            </button>
          </Link>
          <Link to="/resources/resilience" className="booster-link">
            <button className="edu-button resilience">
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
