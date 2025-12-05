import { Link, useLocation } from 'react-router-dom';
import './EmergencyNotification.css';
import './PageLayout.css';

const EmergencyNotification = () => {
  const location = useLocation();
  const notifiedContacts = location.state?.notifiedContacts || [];
  const unverifiedContacts = location.state?.unverifiedContacts || [];
  
  const getIcon = (name) => {
    if (name.toLowerCase().includes('mom') || name.toLowerCase().includes('dad') || name.toLowerCase().includes('parent')) return '👨‍👩‍👧‍👦';
    return '🫂'; 
  };

  const hasUnverifiedEmails = unverifiedContacts.length > 0;

  return (
    <div className="emergency-container">
      <h1 className="page-title" style={{ marginBottom: '10px', textAlign: 'center' }}>
        🚨 Help is on the way
      </h1>

      <p className="notification-subtitle">
        We've notified your support circle ({notifiedContacts.length} contact{notifiedContacts.length !== 1 ? 's' : ''}).
      </p>

      {hasUnverifiedEmails && (
        <div style={{ 
          backgroundColor: '#FFF3CD', 
          border: '2px solid #FFC107',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#856404', 
            margin: '0',
            fontWeight: '600'
          }}>
            ⚠️ Warning: {unverifiedContacts.length} contact{unverifiedContacts.length !== 1 ? 's have' : ' has'} unverified email address{unverifiedContacts.length !== 1 ? 'es' : ''}.
          </p>
          <p style={{ 
            fontSize: '13px', 
            color: '#856404', 
            margin: '8px 0 0 0'
          }}>
            Support signals may not be delivered to: <strong>{unverifiedContacts.join(', ')}</strong>
          </p>
          <p style={{ 
            fontSize: '13px', 
            color: '#856404', 
            margin: '8px 0 0 0'
          }}>
            Please ask them to verify their email addresses in your Support Circle settings.
          </p>
        </div>
      )}

      <div className="notified-card">
        {notifiedContacts.length > 0 ? (
            notifiedContacts.map((contact, index) => (
              <div key={contact._id || index} className="contact-status">
                <span className="contact-icon">{getIcon(contact.name)}</span>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span className="contact-name">{contact.name} ({contact.email})</span>
                  {!contact.emailVerified && (
                    <span style={{ 
                      fontSize: '11px', 
                      color: '#FF6B6B', 
                      fontWeight: '600',
                      marginTop: '2px'
                    }}>
                      ⚠️ Email not verified
                    </span>
                  )}
                </div>
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
        <Link to="/support-circle" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary" style={{ backgroundColor: '#8B5FBF', color: 'white' }}>
            Manage Support Circle
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
