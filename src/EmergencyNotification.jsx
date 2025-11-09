import { Link } from 'react-router-dom';
import './EmergencyNotification.css';

const EmergencyNotification = () => {
  const notifiedContacts = [
    { name: 'Mom', icon: '👩‍👧' },
    { name: 'Best Friend', icon: '👯' },
  ];

  return (
    <div className="emergency-container">
      {/* Header and Avatar */}
      <div className="app-header">
        <h1 className="screen-title">Help is on the way 💜</h1>
        <div className="time-avatar">L</div> 
      </div>

      <p className="notification-subtitle">
        We've notified your support circle.
      </p>

      {/* Notified Contacts List */}
      <div className="notified-card">
        {notifiedContacts.map((contact) => (
          <div key={contact.name} className="contact-status">
            <span className="contact-icon">{contact.icon}</span>
            <span className="contact-name">{contact.name}</span>
            <span className="notification-status">
              Notified 
              <span className="check-mark">✓</span>
            </span>
          </div>
        ))}
      </div>

      {/* Reassurance Message */}
      <p className="reassurance-message">
        Your people will reach out soon. You're not alone in this.
      </p>

      {/* Immediate Action Button -> Links to Mood Log */}
      <Link to="/log-mood" className="breathing-cta-link">
        <button className="breathing-cta-button">
          Try a Quick Breathing Exercise
        </button>
      </Link>
    </div>
  );
};

export default EmergencyNotification;