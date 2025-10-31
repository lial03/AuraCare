import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    return (
        <div className="login-container">
        <div className="login-card">
            <div className="login-header">
            <h1 className="login-title">Log In</h1>
            <p className="login-subtitle">Welcome back to your safe space</p>
            </div>

            <div className="login-form">
            <div className="input-group">
                <input 
                type="email" 
                placeholder="Email or phone number"
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

            <p className="forgot-password">Forgot Password?</p>

            <button 
                className="login-button"
                onClick={() => navigate('/dashboard')}
            >
                Log In
            </button>
            </div>

            <div className="divider">
            <span>or</span>
            </div>

            <div className="social-login">
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

            <p className="signup-link">
            Don't have an account? 
            <span onClick={() => navigate('/signup')}> Sign up</span>
            </p>
        </div>
        </div>
    );
};

export default Login;