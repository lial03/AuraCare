import { Link } from 'react-router-dom';
import './Resources.css';

const Resources = () => {
  return (
    <div className="resources-container">
      {/* Header and Avatar */}
      <div className="app-header">
        <h1 className="screen-title">Well-being Resources</h1>
        <div className="time-avatar">L</div> 
      </div>

      {/* --- Immediate Help Section --- */}
      <div className="section-group">
        <h2 className="section-title">Immediate Help</h2>
        <div className="immediate-help-card">
          <p className="helpline-number">Crisis Helpline: 1-800-273-8255</p>
          <p className="helpline-note">Available 24/7 - You're not alone</p>
        </div>
      </div>

      {/* --- Quick Mood Boosters Section --- */}
      <div className="section-group">
        <h2 className="section-title">Quick Mood Boosters</h2>
        <div className="mood-booster-list">
          {/* Breathing Exercise -> Links to Mood Log */}
          <Link to="/log-mood" className="booster-link">
            <button className="booster-button breathing">
              <span className="booster-icon">🌿</span> 5-Minute Breathing Exercise
            </button>
          </Link>
          {/* Calming Music -> Links to Mood Log */}
          <Link to="/log-mood" className="booster-link">
            <button className="booster-button music">
              <span className="booster-icon">🎵</span> Calming Music Playlist
            </button>
          </Link>
          {/* Gratitude Journaling -> Links to Mood Log */}
          <Link to="/log-mood" className="booster-link">
            <button className="booster-button journaling">
              <span className="booster-icon">📓</span> Gratitude Journaling
            </button>
          </Link>
        </div>
      </div>

      {/* --- Educational Resources Section --- */}
      <div className="section-group">
        <h2 className="section-title">Educational Resources</h2>
        <p className="learn-more">Learn More</p>
        <div className="educational-list">
          {/* Understanding Mental Health -> Links to Mood Log */}
          <Link to="/log-mood" className="booster-link">
            <button className="edu-button mental-health">
              <span className="edu-icon">📚</span> Understanding Mental Health
            </button>
          </Link>
          {/* Building Resilience -> Links to Mood Log */}
          <Link to="/log-mood" className="booster-link">
            <button className="edu-button resilience">
              <span className="edu-icon">🎯</span> Building Resilience
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Resources;