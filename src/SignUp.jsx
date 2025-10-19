import './SignUp.css';

const SignUp = () => {
    return (
        <div className="signup-container">
            <div className="logo-section">
                <div className="logo-circle">
                    <h1 className="logo-title">AuraCare</h1>
                    <span className="heart-icon">🤍</span>
                </div>
            </div>

            <div className="signup-card">
                <div className="tab-navigation">
                    <div className="tab log-in-tab">Log In</div>
                    <div className="tab sign-up-tab active">Sign Up</div>
                </div>
                
                <div className="signup-form">
                    <div className="input-group">
                        <input 
                        type="text" 
                        placeholder="Full Name"
                        className="form-input"
                        />
                    </div>

                    <div className="input-group">
                        <input 
                        type="email" 
                        placeholder="Email"
                        className="form-input"
                        />
                    </div>

                    <div className="input-group">
                        <input 
                        type="tel" 
                        placeholder="Phone Number"
                        className="form-input"
                        />
                    </div>

                    <div className="input-group input-with-icon">
                        <input 
                        type="password" 
                        placeholder="Create password"
                        className="form-input password-input" 
                        />
                        <span className="input-icon">👁️</span> 
                    </div>

                    <button className="signup-button">
                        Create My Safe Space
                    </button>
                </div>

                <p className="login-link bottom-link">
                    Already have an account? <span className="log-in-link-text">Log In</span>
                </p>
            </div>
        </div>
    );
};

export default SignUp;