import './Onboarding.css';

const Onboarding = () => {
  return (
    <div className="onboarding-container">
      <div className="logo-section">
        <div className="logo-circle">
          <span className="hand-wave">👋</span>
        </div>
        <h1 className="app-title">AuraCare</h1>
        <p className="app-tagline">Your pocket of peace</p>
      </div>

      <div className="content-section">
        <div className="illustration">
          <div className="aura-blob"></div>
        </div>

        <p className="onboarding-text">
          Understand your moods, connect with your support circle instantly, and find calm.
        </p>

        <button className="cta-button">
          Create Your Safe Space
        </button>

        <p className="login-link">
          Already have an account? <span>Log In</span>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;