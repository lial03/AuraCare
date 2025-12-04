import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    // Check if fields are empty before proceeding (basic client-side validation)
    if (!formData.identifier || !formData.password) {
        alert('Please enter both email/phone and password.');
        return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token); 
        localStorage.setItem('currentUserId', data.userId); 
        
        navigate('/dashboard'); 
      } else {
        alert(`Login failed: ${data.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error("Network or Fetch Error:", error);
      alert('Could not connect to the server.');
    }
  };

  return (
    <div className="auth-container">
      {/* ... (JSX for Logo and Tabs) ... */}
      <div className="auth-card">
        
        <div className="tab-navigation">
          <Link to="/login" className="tab-button log-in active-tab">Log In</Link>
          <Link to="/signup" className="tab-button sign-up">Sign Up</Link>
          <div className="tab-underline log-in-underline"></div>
        </div>
        
        <div className="login-form-content">
          
          <div className="input-group">
            <input type="text" name="identifier" placeholder="Email or Phone" className="form-input" value={formData.identifier} onChange={handleChange} required/>
          </div>

          <div className="input-group password-group">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="form-input" value={formData.password} onChange={handleChange} required/>
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? "🙈" : "👁️"}
            </span> 
          </div>

          {/* CRITICAL: Logic attached directly to onClick */}
          <button type="button" className="login-button" onClick={handleLogin}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;