import { useState } from 'react';
import { Link } from 'react-router-dom';
import './PageLayout.css';

const PrivacySettings = () => {
  const [dataSharing, setDataSharing] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('private');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would send to the backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
              backgroundColor: '#F8F8F8'
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
        <Link to="/change-password" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary" style={{ marginBottom: '15px' }}>
            Change Password
          </button>
        </Link>
      </div>

      <div className="content-card">
        <h2 className="section-heading">Data & Privacy</h2>
        <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '10px' }}>
          <strong>Your Data:</strong> All your mood logs, journal entries, and support circle information are stored securely and encrypted.
        </p>
        <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '10px' }}>
          <strong>Data Deletion:</strong> You can request to delete your account and all associated data at any time.
        </p>
        <Link to="/delete-account" style={{ textDecoration: 'none' }}>
          <button className="btn-danger" style={{ marginTop: '10px' }}>
            Delete My Account
          </button>
        </Link>
      </div>

      <div className="content-card">
        <h2 className="section-heading">Privacy Policy</h2>
        <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '10px' }}>
          For more information about how we handle your data, please read our full privacy policy.
        </p>
        <a href="#" style={{ color: '#8B5FBF', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
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
