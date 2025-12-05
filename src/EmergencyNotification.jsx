import { Link, useLocation } from 'react-router-dom';
import './EmergencyNotification.css';
import './PageLayout.css';

const EmergencyNotification = () => {
  const location = useLocation();
  const contactReports = location.state?.contactReports || []; // Use contactReports
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
        We've attempted to notify your support circle ({contactReports.length} contact{contactReports.length !== 1 ? 's' : ''}).
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
        {contactReports.length > 0 ? (
            contactReports.map((report, index) => {
                const isSent = report.deliveryStatus === 'SENT';
                const statusText = isSent ? 'Sent' : 'Failed';
                const statusColor = isSent ? '#4CAF50' : '#FF6B6B';
                const statusIcon = isSent ? '✔' : '❌';

                return (
                    <div key={report._id || index} className="contact-status">
                        <span className="contact-icon">{getIcon(report.name)}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <span className="contact-name">{report.name} ({report.email})</span>
                            {!report.emailVerified && (
                                <span style={{ 
                                    fontSize: '11px', 
                                    color: '#FFC107', 
                                    fontWeight: '600',
                                    marginTop: '2px'
                                }}>
                                    ⚠️ Email unverified (Potential future issue)
                                </span>
                            )}
                        </div>
                        <span className="notification-status" style={{ color: statusColor }}>
                            {statusText} 
                            <span style={{ color: statusColor, marginLeft: '5px' }}>{statusIcon}</span>
                        </span>
                    </div>
                );
            })
        ) : (
            <div className="contact-status">
                <span className="contact-name">No contacts were found in your support circle.</span>
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