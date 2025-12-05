import { Link, useLocation } from 'react-router-dom';
import './EmergencyNotification.css';
import './PageLayout.css';

const EmergencyNotification = () => {
  const location = useLocation();
  const notifiedContacts = location.state?.notifiedContacts || [];
  
  const getIcon = (name) => {
    if (name.toLowerCase().includes('mom') || name.toLowerCase().includes('dad') || name.toLowerCase().includes('parent')) return '👨‍👩‍👧‍👦';
    return '🫂'; 
  };

  return (
    <div className="emergency-container">
      <h1 className="page-title" style={{ marginBottom: '10px', textAlign: 'center' }}>
        🚨 Help is on the way
      </h1>

      <p className="notification-subtitle">
        We've notified your support circle ({notifiedContacts.length} contact{notifiedContacts.length !== 1 ? 's' : ''}).
      </p>

      <div className="notified-card">
        {notifiedContacts.length > 0 ? (
            notifiedContacts.map((contact, index) => (
              <div key={contact._id || index} className="contact-status">
                <span className="contact-icon">{getIcon(contact.name)}</span>
                <span className="contact-name">{contact.name} ({contact.email})</span> 
                <span className="notification-status">
                  Notified 
                  <span className="check-mark">✔</span>
                </span>
              </div>
            ))
        ) : (
            <div className="contact-status">
                <span className="contact-name">No contacts were notified.</span>
                <span className="notification-status" style={{ color: '#FF6B8B' }}>
                  Check Circle
                </span>
            </div>
        )}
      </div>

      <p className="reassurance-message">
        Your people will reach out soon. You're not alone in this.
      </p>

      <div className="button-group">
        <Link to="/breathing-exercise" style={{ textDecoration: 'none' }}>
          <button className="btn-primary">
            Try a Quick Breathing Exercise
          </button>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EmergencyNotification;
