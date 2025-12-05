import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PageLayout.css';
import './SupportCircle.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const SupportCircle = () => {
  const navigate = useNavigate();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState(''); 
  const [supportCircle, setSupportCircle] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [editingContactId, setEditingContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });
  
  // --- NEW STATE FOR AI FEATURE ---
  const [communicationScript, setCommunicationScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  // --- END NEW STATE ---

  const userId = localStorage.getItem('currentUserId'); 
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId || !token) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setUserName(data.fullName || 'User');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };
    
    fetchUserName();
  }, [userId, token]);

  const fetchSupportCircle = async () => {
    if (!userId || !token) {
        setLoading(false);
        return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
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
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    if (!token) {
        alert('Session expired. Please log in.');
        navigate('/login');
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/support-circle`, {
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

  const handleVerify = async (contactId) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/support-circle/${contactId}/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setSupportCircle(data.supportCircle);
                alert(data.message);
            } else {
                alert(`Failed to verify contact: ${data.message}`);
            }
        } catch (error) {
            console.error('Verification error:', error);
            alert('An error occurred during verification.');
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
        const response = await fetch(`${API_BASE_URL}/api/support-circle/${contactId}`, {
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

  const handleEditClick = (contact) => {
    setEditingContactId(contact._id);
    setEditFormData({ name: contact.name, email: contact.email });
  };

  const handleCancelEdit = () => {
    setEditingContactId(null);
    setEditFormData({ name: '', email: '' });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateContact = async (contactId) => {
    if (!editFormData.name || !editFormData.email) {
      alert('Please enter both name and email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!token) {
        alert('Session expired. Please log in.');
        navigate('/login');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/support-circle/${contactId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ name: editFormData.name, email: editFormData.email })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Contact updated successfully!');
            setSupportCircle(data.supportCircle);
            setEditingContactId(null);
            setEditFormData({ name: '', email: '' });
        } else if (response.status === 401 || response.status === 400) {
            alert('Session expired. Please log in again.');
            navigate('/login');
        } else {
            alert(`Failed to update contact: ${data.message || 'Server Error'}`);
        }
    } catch (error) {
        alert('Could not connect to the server.');
    }
  };
  
  // --- NEW HANDLER FOR AI SCRIPT ---
  const handleGenerateScript = async () => {
    if (!token) {
        alert('Session expired. Please log in.');
        navigate('/login');
        return;
    }
    
    setIsGeneratingScript(true);
    setCommunicationScript('');

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-script`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setCommunicationScript(data.script);
        } else {
            alert(`Failed to generate script: ${data.message || 'Server error'}`);
        }
    } catch (error) {
        alert('Could not connect to the server.');
    } finally {
        setIsGeneratingScript(false);
    }
  };
  // --- END NEW HANDLER ---

  return (
    <div className="support-circle-container">
      <Link to="/dashboard" className="back-button-link">« Back to Dashboard</Link>
      <h1 className="page-title">👥 My Support Circle</h1>

      <p className="page-subtitle">
        Add trusted contacts who will be notified when you need support
      </p>

      {/* --- NEW AI PROACTIVE CHECK-IN CARD --- */}
      <div className="content-card" style={{ backgroundColor: '#FFF7E6', borderLeft: '5px solid #FFA500' }}>
        <h2 className="section-heading" style={{ marginTop: '0', color: '#FFA500' }}>💡 Proactive Check-in</h2>
        <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '15px' }}>
          Use AI to generate a low-pressure, friendly message to send to a contact and maintain your social connections, even when you feel okay.
        </p>

        {communicationScript ? (
            <>
                <p style={{ 
                    fontSize: '16px', 
                    color: '#2D2D2D', 
                    padding: '15px', 
                    backgroundColor: '#F8F8F8', 
                    borderRadius: '8px', 
                    border: '1px dashed #C4B0E8', 
                    whiteSpace: 'pre-wrap'
                }}>
                    {communicationScript}
                </p>
                <button 
                    onClick={() => { navigator.clipboard.writeText(communicationScript); alert('Message copied to clipboard!'); }}
                    className="btn-secondary"
                    style={{ marginTop: '10px', height: '40px', maxWidth: '200px' }}
                >
                    📋 Copy to Clipboard
                </button>
                <button 
                    onClick={() => setCommunicationScript('')}
                    className="btn-secondary"
                    style={{ marginTop: '10px', height: '40px', maxWidth: '200px', marginLeft: '10px' }}
                >
                    Generate New Script
                </button>
            </>
        ) : (
            <button 
                className="btn-primary" 
                onClick={handleGenerateScript}
                style={{ 
                    backgroundColor: '#A06FC7',
                    height: '45px', 
                    boxShadow: 'none'
                }}
                disabled={isGeneratingScript}
            >
                {isGeneratingScript ? 'Generating Script...' : 'Generate Check-In Script'}
            </button>
        )}
      </div>
      {/* --- END AI PROACTIVE CHECK-IN CARD --- */}

      <div className="content-card">
        <h2 className="section-heading">Your Contacts</h2>
        {loading ? (
            <p style={{ color: '#6B6B6B', textAlign: 'center' }}>Loading contacts...</p>
        ) : supportCircle.length > 0 ? (
            <div className="actual-contacts-list">
                {supportCircle.map((contact) => (
                    <div key={contact._id} className="actual-contact-item">
                        {editingContactId === contact._id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditChange}
                                    placeholder="Contact Name"
                                    style={{
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid #E0E0E0',
                                        fontSize: '14px'
                                    }}
                                />
                                <input 
                                    type="email" 
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleEditChange}
                                    placeholder="Contact Email"
                                    style={{
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid #E0E0E0',
                                        fontSize: '14px'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => handleUpdateContact(contact._id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#8B5FBF',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={handleCancelEdit}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#E0E0E0',
                                            color: '#2D2D2D',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                                    <span className="contact-details">👥 {contact.name} - {contact.email}</span>
                                    {!contact.emailVerified && (
                                        <span style={{ 
                                            fontSize: '12px', 
                                            color: '#FF6B6B', 
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            ⚠️ Email not verified - Support signals may not be delivered
                                        </span>
                                    )}
                                    {contact.emailVerified && (
                                        <span style={{ 
                                            fontSize: '12px', 
                                            color: '#4CAF50', 
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            ✓ Email verified
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    {!contact.emailVerified && (
                                        <button 
                                            className="verify-button" 
                                            onClick={() => handleVerify(contact._id)}
                                            style={{ 
                                                backgroundColor: '#007bff', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '6px 12px', 
                                                borderRadius: '6px', 
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                marginRight: '10px'
                                            }}
                                        >
                                            Mark as Verified
                                        </button>
                                    )}
                                    <button 
                                        className="edit-contact-button" 
                                        onClick={() => handleEditClick(contact)}
                                        aria-label={`Edit ${contact.name}`}
                                        title="Edit contact"
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#F0F0F0',
                                            color: '#2D2D2D',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button 
                                        className="delete-contact-button" 
                                        onClick={() => handleDeleteContact(contact._id)}
                                        aria-label={`Remove ${contact.name}`}
                                        title="Remove contact"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6B6B6B' }}>
                No contacts added yet. Add your first contact below.
            </div>
        )}
      </div>

      <div className="content-card">
        <h2 className="section-heading">Add New Contact</h2>
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
      </div>

      <p className="notification-note">
        💡 These contacts will receive an email when you use 'I Need Support Now'
      </p>

      <div className="button-group">
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary">Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default SupportCircle;