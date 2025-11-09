import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignUp = async () => {
    // Check if required fields are filled before proceeding
    if (!formData.fullName || !formData.email || !formData.password) {
        alert('Please fill in required fields (Name, Email, Password).');
        return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Sign up successful! Please log in.');
        navigate('/login'); 
      } else {
        alert(`${data.message}`);
      }
    } catch (error) {
      console.error("Network or Fetch Error:", error);
      alert('Could not connect to the server.');
    }
  };

  return (
    <div className="auth-container">
      {/* ... (Logo and Tabs) ... */}
      <div className="auth-card">
        
        <div className="tab-navigation">
          <Link to="/login" className="tab-button log-in">Log In</Link>
          <Link to="/signup" className="tab-button sign-up active-tab">Sign Up</Link>
          <div className="tab-underline sign-up-underline"></div>
        </div>
        
        {/* Removed <form> tag */}
        <div className="signup-form-content">
          
          <div className="input-group">
            <input type="text" name="fullName" placeholder="Full Name" className="form-input" value={formData.fullName} onChange={handleChange} required/>
          </div>

          <div className="input-group">
            <input type="email" name="email" placeholder="Email" className="form-input" value={formData.email} onChange={handleChange} required/>
          </div>

          <div className="input-group">
            <input type="tel" name="phoneNumber" placeholder="Phone Number" className="form-input" value={formData.phoneNumber} onChange={handleChange}/>
          </div>

          <div className="input-group password-group">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Create password" className="form-input" value={formData.password} onChange={handleChange} required/>
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? "🙈" : "👁️"}
            </span> 
          </div>

          {/* CRITICAL: Logic attached directly to onClick */}
          <button type="button" className="signup-button" onClick={handleSignUp}>
            Create My Safe Space
          </button>
        </div>
      </div>
      
      <p className="login-link-outside">
        Already have an account? <Link to="/login" className="login-link-anchor">Log In</Link>
      </p>
    </div>
  );
};

export default SignUp;