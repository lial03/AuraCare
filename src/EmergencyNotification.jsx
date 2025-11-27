import { Link, useLocation } from 'react-router-dom';
import './EmergencyNotification.css';

const EmergencyNotification = () => {
  const location = useLocation();
  const notifiedContacts = location.state?.notifiedContacts || []; 
  
  const getIcon = (name) => {
    if (name.toLowerCase().includes('mom') || name.toLowerCase().includes('dad') || name.toLowerCase().includes('parent')) return '👨‍👩‍👧‍👦';
    return '🫂'; 
  };

  return (
    <div className="emergency-container">
      <div className="app-header">
        <h1 className="screen-title">Help is on the way 🚨</h1>
        <div className="time-avatar">L</div> 
      </div>

      <p className="notification-subtitle">
        We've notified your support circle ({notifiedContacts.length} contacts).
      </p>

      <div className="notified-card">
        {notifiedContacts.length > 0 ? (
            notifiedContacts.map((contact, index) => (
              <div key={contact._id || index} className="contact-status">
                <span className="contact-icon">{getIcon(contact.name)}</span>
                <span className="contact-name">{contact.name}</span>
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

      <Link to="/breathing-exercise" className="breathing-cta-link">
        <button className="breathing-cta-button">
          Try a Quick Breathing Exercise
        </button>
      </Link>
    </div>
  );
};

export default EmergencyNotification;