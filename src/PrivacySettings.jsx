import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PageLayout.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [dataSharing, setDataSharing] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('private');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/privacy-settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok) {
          const settings = data.privacySettings;
          setDataSharing(settings.dataSharing);
          setProfileVisibility(settings.profileVisibility);
        } else if (response.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
        } else {
          setError('Failed to load privacy settings.');
        }
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
        setError('Could not connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token, navigate]);

  const handleSave = async () => {
    if (!token) {
      alert('Session expired. Please log in.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/privacy-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dataSharing,
          profileVisibility
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else if (response.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        alert(`Failed to save settings: ${data.message || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      alert('Could not connect to the server.');
    }
  };

  const handleChangePassword = async () => {
      // NOTE: In a production app, you would use a dedicated modal/form. 
      // Using prompt() here for quick implementation.
      const oldPassword = prompt("Please enter your current password:");
      if (!oldPassword) return; 

      const newPassword = prompt("Please enter your new password:");
      if (!newPassword) return;
      
      if (newPassword.length < 6) { 
          alert("New password must be at least 6 characters long.");
          return;
      }

      try {
          const response = await fetch(`${API_BASE_URL}/api/profile/password`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ oldPassword, newPassword })
          });

          const data = await response.json();

          if (response.ok) {
              alert(data.message); // Success message includes "Please log in again."
              localStorage.removeItem('authToken'); 
              navigate('/login'); // Redirect to login
          } else {
              alert(`Failed to change password: ${data.message || 'Server error'}`);
          }
      } catch (error) {
          alert('Could not connect to the server.');
      }
  };

  const handleDeleteAccount = async () => {
      const confirmation = window.confirm('WARNING: Are you absolutely sure you want to delete your AuraCare account? This action is permanent and will delete ALL your mood history, journals, and support contacts.');
      if (!confirmation) return;
      
      try {
          const response = await fetch(`${API_BASE_URL}/api/profile`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });

          const data = await response.json();

          if (response.ok) {
              alert(data.message);
              localStorage.removeItem('authToken'); 
              localStorage.removeItem('currentUserId'); 
              navigate('/'); // Go back to the Onboarding page
          } else {
              alert(`Failed to delete account: ${data.message || 'Server error'}`);
          }
      } catch (error) {
          alert('Could not connect to the server.');
      }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Link to="/profile" className="back-button-link">« Back to Profile</Link>
        <h1 className="page-title">🔒 Privacy & Security</h1>
        <p style={{ textAlign: 'center', color: '#6B6B6B', padding: '40px' }}>Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Link to="/profile" className="back-button-link">« Back to Profile</Link>
        <h1 className="page-title">🔒 Privacy & Security</h1>
        <div style={{ 
          backgroundColor: '#FFE6E6', 
          color: '#D32F2F', 
          padding: '15px', 
          borderRadius: '12px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
        <div className="button-group">
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary">Back to Profile</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/profile" className="back-button-link">« Back to Profile</Link>
      <h1 className="page-title">🔒 Privacy & Security</h1>
      
      <p className="page-subtitle">Control your privacy settings and keep your account secure</p>

      <div className="content-card">
        <h2 className="section-heading">Data Privacy</h2>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label style={{ fontSize: '16px', color: '#2D2D2D' }}>
              Share mood data for research
            </label>
            <input 
              type="checkbox" 
              checked={dataSharing}
              onChange={(e) => setDataSharing(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
          <p style={{ fontSize: '14px', color: '#6B6B6B', margin: '0' }}>
            Help improve mental health research by anonymously sharing your mood data. Your identity will never be revealed.
          </p>
        </div>
      </div>

      <div className="content-card">
        <h2 className="section-heading">Profile Visibility</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', color: '#6B6B6B', display: 'block', marginBottom: '10px' }}>
            Who can see your profile information?
          </label>
          <select 
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #E0E0E0',
              fontSize: '16px',
              color: '#2D2D2D',
              backgroundColor: '#F8F8F8',
              cursor: 'pointer'
            }}
          >
            <option value="private">Only Me (Private)</option>
            <option value="contacts">My Support Circle Only</option>
            <option value="public">Everyone</option>
          </select>
        </div>
      </div>

      <div className="content-card">
        <h2 className="section-heading">Account Security</h2>
        <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '15px' }}>
          Your password is encrypted and stored securely. We recommend changing your password regularly.
        </p>
        <button 
          className="btn-secondary" 
          style={{ marginBottom: '15px' }}
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      </div>

      <div className="content-card">
        <h2 className="section-heading">Data & Privacy</h2>
        <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '10px' }}>
          <strong>Your Data:</strong> All your mood logs, journal entries, and support circle information are stored securely and encrypted.
        </p>
        <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '10px' }}>
          <strong>Data Deletion:</strong> You can request to delete your account and all associated data at any time.
        </p>
        <button 
          className="btn-danger" 
          style={{ 
            marginTop: '10px',
            backgroundColor: '#D32F2F',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          onClick={handleDeleteAccount}
        >
          Delete My Account
        </button>
      </div>

      <div className="content-card">
        <h2 className="section-heading">Privacy Policy</h2>
        <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '10px' }}>
          For more information about how we handle your data, please read our full privacy policy.
        </p>
        <a 
          href="https://www.auracare.com/privacy-policy" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#8B5FBF', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
        >
          Read Privacy Policy →
        </a>
      </div>

      {saved && (
        <div style={{ 
          backgroundColor: '#E8F5E9', 
          color: '#2E7D32', 
          padding: '15px', 
          borderRadius: '12px', 
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          ✓ Settings saved successfully!
        </div>
      )}

      <div className="button-group">
        <button className="btn-primary" onClick={handleSave}>
          Save Settings
        </button>
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary">Cancel</button>
        </Link>
      </div>
    </div>
  );
};

export default PrivacySettings;
