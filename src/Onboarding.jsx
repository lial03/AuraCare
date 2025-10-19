import './Onboarding.css';

const Onboarding = () => {
    return (
        <div className="onboarding-container">
            <div className="logo-section">
                <div className="logo-circle">
                    <h1 className="logo-title">AuraCare</h1>
                    <span className="heart-icon">🤍</span>
                </div>
                <p className="app-tagline">Your pocket of peace</p>
            </div>

            <div className="illustration-section">
                <div className="icon-line">
                    <span className="icon chart-icon">📈</span> 
                    <div className="line"></div>
                    <span className="icon handshake-icon">🤝</span>
                    <div className="line"></div>
                    <span className="icon sparkle-icon">✨</span>
                </div>
            </div>

            <div className="content-section">
                <p className="onboarding-text">
                    Understand your moods, connect with your support circle instantly, and find calm.
                </p>

                <button className="cta-button">
                    Create Your Safe Space
                </button>

                <p className="login-link">
                    I already have an account
                </p>
            </div>
        </div>
    );
};

export default Onboarding;