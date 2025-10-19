import './SignUp.css';

function SignUp(){
    return (
        <div className="signup-container">
            <div className="signup-card">

                <div className="signup-header">
                    <h1 className="signup-title">Sign Up</h1>
                    <h2 className="signup-subtitle">Create Your Account</h2>
                </div>

                {/* Sign-up form */}
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
                            placeholder="Email Address"
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

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Create Password"
                            className="form-input"
                        />
                    </div>

                    <button className="signup-button">
                        Create My Safe Space
                    </button>   
                </div>

                <div className="divider">
                    <span>or</span>
                </div>

                <div className="social-signup">
                    <button className="social-button google">
                        <span className="social-icon">G</span>
                        Sign Up with Google
                    </button>

                    <button className="social-button apple">
                        <span className="social-icon">A</span>
                        Sign Up with Apple
                    </button>

                    <button className="social-button facebook">
                        <span className="social-icon">f</span>
                        Sign Up with Facebook
                    </button>
                </div>

                <p className="login-link">
                    Already have an account? <span>Log In</span>
                </p>
            </div>
        </div>
    );
}

export default SignUp;