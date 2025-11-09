import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SupportCircle.css'; // Correct local import

const SupportCircle = () => {
  const navigate = useNavigate();
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [supportCircle, setSupportCircle] = useState([]); 
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('currentUserId'); 
  const token = localStorage.getItem('authToken');

  // --- 1. Fetch Existing Support Circle ---
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

  // --- 2. Handle Adding New Contact ---
  const handleAddContact = async () => {
    if (!contactName || !contactPhone) {
      alert('Please enter both name and phone number.');
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
            'Authorization': `Bearer ${token}` // CRUCIAL: Sending the token
        },
        body: JSON.stringify({ name: contactName, phone: contactPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Contact added successfully!');
        setSupportCircle(data.supportCircle); // Update the local state with the new list
        setContactName('');
        setContactPhone('');
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

  return (
    <div className="support-circle-container">
      <div className="app-header">
        <h1 className="screen-title">My Support Circle</h1>
        <div className="time-avatar">L</div> 
      </div>

      <p className="screen-description">
        Add trusted contacts who will be notified when you need support
      </p>

      {/* Contacts List Placeholder (Updated to show real contacts) */}
      <div className="contacts-list-placeholder">
        {loading ? (
            <p>Loading contacts...</p>
        ) : supportCircle.length > 0 ? (
            supportCircle.map((contact, index) => (
                <div key={index} className="actual-contact-item">
                    👥 {contact.name} - {contact.phone}
                </div>
            ))
        ) : (
            "No contacts added yet"
        )}
      </div>

      {/* Input Form for New Contacts */}
      <div className="contact-input-form">
        <input 
          type="text" 
          placeholder="Contact Name" 
          className="form-input-name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />
        <input 
          type="tel" 
          placeholder="Phone Number" 
          className="form-input-phone"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
        
        <button className="add-to-circle-button" onClick={handleAddContact}>
          Add To My Circle
        </button>
      </div>

      <p className="notification-note">
        These contacts will receive an SMS when you use 'I Need Support Now'
      </p>
    </div>
  );
};

export default SupportCircle;