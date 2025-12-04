import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SupportCircle.css';

const SupportCircle = () => {
  const navigate = useNavigate();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState(''); 
  const [supportCircle, setSupportCircle] = useState([]); 
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('currentUserId'); 
  const token = localStorage.getItem('authToken');

  const fetchSupportCircle = async () => {
    if (!userId || !token) {
        setLoading(false);
        return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
          headers: {
              'Authorization': `Bearer ${token}` 
          }
      });
      const data = await response.json();
      
      if (response.ok && data.supportCircle) {
        setSupportCircle(data.supportCircle);
      }
    } catch (error) {
      console.error('Error fetching support circle:', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportCircle();
  }, [userId, token]);

  const handleAddContact = async () => {
    if (!contactName || !contactEmail) {
      alert('Please enter both name and email address.');
      return;
    }
    
    if (!token) {
        alert('Session expired. Please log in.');
        navigate('/login');
        return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/support-circle', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: contactName, email: contactEmail }), 
      });

      const data = await response.json();

      if (response.ok) {
        alert('Contact added successfully!');
        setSupportCircle(data.supportCircle);
        setContactName('');
        setContactEmail(''); 
      } else if (response.status === 401 || response.status === 400) {
          alert('Session expired. Please log in again.');
          navigate('/login');
      } else {
        alert(`Failed to add contact: ${data.message || 'Server Error'}`);
      }
    } catch (error) {
      alert('Could not connect to the server.');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!token) {
        alert('Session expired. Please log in.');
        navigate('/login');
        return;
    }

    if (!window.confirm("Are you sure you want to remove this contact?")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/support-circle/${contactId}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('Contact removed successfully!');
            setSupportCircle(data.supportCircle);
        } else if (response.status === 401 || response.status === 400) {
            alert('Session expired. Please log in again.');
            navigate('/login');
        } else {
            alert(`Failed to delete contact: ${data.message || 'Server Error'}`);
        }
    } catch (error) {
        alert('Could not connect to the server.');
    }
  };


  return (
    <div className="support-circle-container">
      <div className="app-header">
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#8B5FBF', fontWeight: '600', fontSize: '16px', lineHeight: '1', position: 'absolute', left: '20px' }}>
            « Back
        </Link>
        <h1 className="screen-title">My Support Circle</h1>
        <div className="time-avatar">L</div> 
      </div>

      <p className="screen-description">
        Add trusted contacts who will be notified when you need support
      </p>

      <div className="contacts-list-placeholder">
        {loading ? (
            <p>Loading contacts...</p>
        ) : supportCircle.length > 0 ? (
            <div className="actual-contacts-list">
                {supportCircle.map((contact) => (
                    <div key={contact._id} className="actual-contact-item">
	                        <span className="contact-details">👥 {contact.name} - {contact.email}</span> 

                        <button 
                            className="delete-contact-button" 
                            onClick={() => handleDeleteContact(contact._id)}
                            aria-label={`Remove ${contact.name}`}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            "No contacts added yet"
        )}
      </div>

      <div className="contact-input-form">
        <input 
          type="text" 
          placeholder="Contact Name" 
          className="form-input-name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />
	        <input 
	          type="email" 
	          placeholder="Contact Email"
	          className="form-input-email" 
	          value={contactEmail}
	          onChange={(e) => setContactEmail(e.target.value)} 
	        />

        
        <button className="add-to-circle-button" onClick={handleAddContact}>
          Add To My Circle
        </button>
      </div>

	      <p className="notification-note">
	        These contacts will receive an **EMAIL** when you use 'I Need Support Now'
	      </p>

    </div>
  );
};

export default SupportCircle;