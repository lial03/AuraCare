import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PageLayout.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [moodReminders, setMoodReminders] = useState(true);
  const [supportAlerts, setSupportAlerts] = useState(true);
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
        const response = await fetch(`${API_BASE_URL}/api/notification-settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok) {
          const settings = data.notificationSettings;
          setEmailNotifications(settings.emailNotifications);
          setMoodReminders(settings.moodReminders);
          setSupportAlerts(settings.supportAlerts);
        } else if (response.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
        } else {
          setError('Failed to load notification settings.');
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
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
      const response = await fetch(`${API_BASE_URL}/api/notification-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          emailNotifications,
          moodReminders,
          supportAlerts
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
      console.error('Error saving notification settings:', error);
      alert('Could not connect to the server.');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Link to="/profile" className="back-button-link">« Back to Profile</Link>
        <h1 className="page-title">🔔 Notification Settings</h1>
        <p style={{ textAlign: 'center', color: '#6B6B6B', padding: '40px' }}>Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Link to="/profile" className="back-button-link">« Back to Profile</Link>
        <h1 className="page-title">🔔 Notification Settings</h1>
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
      <h1 className="page-title">🔔 Notification Settings</h1>
      
      <p className="page-subtitle">Manage how you receive notifications from AuraCare</p>

      <div className="content-card">
        <h2 className="section-heading">Email Notifications</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ fontSize: '16px', color: '#2D2D2D' }}>
            Receive email notifications from support circle
          </label>
          <input 
            type="checkbox" 
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>
        <p style={{ fontSize: '14px', color: '#6B6B6B', margin: '0' }}>
          Get notified when your support circle reaches out or when important updates are available.
        </p>
      </div>

      <div className="content-card">
        <h2 className="section-heading">Mood Check-In Reminders</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ fontSize: '16px', color: '#2D2D2D' }}>
            Daily mood logging reminders
          </label>
          <input 
            type="checkbox" 
            checked={moodReminders}
            onChange={(e) => setMoodReminders(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>
        <p style={{ fontSize: '14px', color: '#6B6B6B', margin: '0' }}>
          Receive gentle reminders to log your mood at the same time each day.
        </p>
      </div>

      <div className="content-card">
        <h2 className="section-heading">Support Signal Alerts</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ fontSize: '16px', color: '#2D2D2D' }}>
            Confirm support signal activation
          </label>
          <input 
            type="checkbox" 
            checked={supportAlerts}
            onChange={(e) => setSupportAlerts(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>
        <p style={{ fontSize: '14px', color: '#6B6B6B', margin: '0' }}>
          Get a confirmation when you activate the "I Need Support Now" signal.
        </p>
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

export default NotificationSettings;
