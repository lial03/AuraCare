import { Link } from 'react-router-dom';
import './Resources.css';

const Resources = () => {
  return (
    <div className="resources-container">
      <div className="app-header">
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#8B5FBF', fontWeight: '600', fontSize: '16px', lineHeight: '1', position: 'absolute', left: '20px' }}>
            « Back
        </Link>
        <h1 className="screen-title">Well-being Resources</h1>
        <div className="time-avatar">L</div> 
      </div>

      <div className="section-group">
        <h2 className="section-title">Immediate Help</h2>
        <div className="immediate-help-card">
          <p className="helpline-number">Crisis Helpline: 1-800-273-8255</p>
          <p className="helpline-note">Available 24/7 - You're not alone</p>
        </div>
      </div>

      <div className="section-group">
        <h2 className="section-title">Quick Mood Boosters</h2>
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
        <h2 className="section-title">Educational Resources</h2>
        <p className="learn-more">Learn More</p>
        <div className="educational-list">
          <a href="https://www.nimh.nih.gov/health/topics/child-and-adolescent-mental-health" target="_blank" rel="noopener noreferrer" className="booster-link">
            <button className="edu-button mental-health">
              <span className="edu-icon">📚</span> Understanding Mental Health
            </button>
          </a>
          <a href="https://jedfoundation.org/how-to-build-resilience-in-teens-and-young-adults/" target="_blank" rel="noopener noreferrer" className="booster-link">
            <button className="edu-button resilience">
              <span className="edu-icon">🎯</span> Building Resilience
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Resources;