import { Link } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  return (
    <div className="onboarding-container">
      {/* 1. Logo Section (AuraCare Heart & Tagline) */}
      <div className="logo-section">
        <div className="logo-circle">
          <div className="heart-logo">🤍</div> 
          <span className="app-name">AuraCare</span>
        </div>
        <p className="app-tagline">Your pocket of peace</p>
      </div>

      {/* 2. Illustration Section (Mood, Support, Calm) */}
      <div className="illustration-line">
        <div className="icon mood-graph">📈</div>
        <div className="icon handshake">🤝</div>
        <div className="icon sparkle">✨</div>
      </div>

      {/* 3. Main Text Content */}
      <div className="content-section">
        <p className="main-description">
          Understand your moods, connect with your support circle instantly, and find calm.
        </p>
        
        {/* Call to Action Button -> Links to Sign Up */}
        <Link to="/signup" className="cta-button-link">
          <button className="cta-button">
            Create Your Safe Space
          </button>
        </Link>

        {/* Login Link -> Links to Log In */}
        <p className="login-link">
          <Link to="/login" className="login-link-anchor">I already have an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;