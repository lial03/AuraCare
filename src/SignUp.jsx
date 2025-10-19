import './SignUp.css';

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">Sign Up</h1>
          <p className="signup-subtitle">Create your safe space</p>
        </div>

        <div className="signup-form">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Full name"
              className="form-input"
            />
          </div>

          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email address"
              className="form-input"
            />
          </div>

          <div className="input-group">
            <input 
              type="tel" 
              placeholder="Phone number"
              className="form-input"
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              placeholder="Create password"
              className="form-input"
            />
          </div>

          <button className="signup-button">
            Create Account
          </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-signup">
          <button className="social-button google">
            <span className="social-icon">G</span>
            Continue with Google
          </button>
          
          <button className="social-button apple">
            <span className="social-icon">A</span>
            Continue with Apple
          </button>
          
          <button className="social-button facebook">
            <span className="social-icon">f</span>
            Continue with Facebook
          </button>
        </div>

        <p className="login-link">
          Already have an account? <span>Log in</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;