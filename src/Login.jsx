import './Login.css';

const Login = () => {
    return (
        <div className="login-container">
            <div className="logo-section">
                <div className="logo-circle">
                    <h1 className="logo-title">AuraCare</h1>
                    <span className="heart-icon">🤍</span>
                </div>
            </div>

            <div className="login-card">
                <div className="tab-navigation">
                    <div className="tab log-in-tab active">Log In</div>
                    <div className="tab sign-up-tab">Sign Up</div>
                </div>
                
                <div className="login-form">
                    <div className="input-group">
                        <input 
                        type="email" 
                        placeholder="Email or Phone"
                        className="form-input"
                        />
                    </div>

                    <div className="input-group">
                        <input 
                        type="password" 
                        placeholder="Password"
                        className="form-input"
                        />
                    </div>

                    <button className="login-button">
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;