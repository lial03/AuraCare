import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ 
        fullName: 'Loading...', 
        email: 'loading@example.com',
        phoneNumber: ''
    });
    const [isEditing, setIsEditing] = useState(false); 
    const [editFormData, setEditFormData] = useState({}); 
    
    const userId = localStorage.getItem('currentUserId'); 
    const token = localStorage.getItem('authToken');

    const fetchProfile = async () => {
        if (!userId || !token) { return; }
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }); 
            const data = await response.json();
            
            if (response.ok) {
                const profileData = {
                    fullName: data.fullName || 'User Name',
                    email: data.email || 'user@example.com',
                    phoneNumber: data.phoneNumber || ''
                };
                setUser(profileData);
                setEditFormData(profileData);
            }
        } catch (error) {
            console.error('Network error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userId, token]);

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    fullName: editFormData.fullName,
                    phoneNumber: editFormData.phoneNumber
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Profile updated successfully!');
                setUser(data.user);
                setIsEditing(false);
            } else {
                alert(`Update failed: ${data.message || 'Server error'}`);
            }
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('currentUserId'); 
        alert('You have been securely logged out.');
        navigate('/'); 
    };

    return (
        <div className="profile-container">
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#8B5FBF', fontWeight: '600', fontSize: '16px', marginBottom: '30px', display: 'block' }}>
                « Back to Dashboard
            </Link>
            <h1 className="screen-title">My Profile</h1>

            {isEditing ? (
                <form className="user-info-card edit-mode" onSubmit={handleUpdateSubmit}>
                    <input type="text" name="fullName" value={editFormData.fullName} onChange={handleEditChange} required/>
                    <input type="tel" name="phoneNumber" placeholder="Phone Number" value={editFormData.phoneNumber} onChange={handleEditChange}/>
                    <div className="edit-buttons">
                        <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button type="submit" className="save-button">Save Changes</button>
                    </div>
                </form>
            ) : (
                <div className="user-info-card view-mode">
                    <div className="user-avatar-large">{user.fullName[0] || 'L'}</div>
                    <div className="user-details">
                        <p className="user-name">{user.fullName}</p>
                        <p className="user-email">{user.email}</p>
                    </div>
                    <button className="edit-profile-button" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                </div>
            )}

            {!isEditing && (
                <div className="settings-list">
                    <Link to="/notifications" className="settings-link"><div className="settings-item"><span className="item-icon">🔔</span><span className="item-text">Notifications</span><span className="arrow-icon">›</span></div></Link>
                    <Link to="/support-circle" className="settings-link"><div className="settings-item"><span className="item-icon">👥</span><span className="item-text">My Support Circle</span><span className="arrow-icon">›</span></div></Link>
                    <Link to="/privacy" className="settings-link"><div className="settings-item"><span className="item-icon">🔒</span><span className="item-text">Privacy & Security</span><span className="arrow-icon">›</span></div></Link>
                    <Link to="/support-circle" className="settings-link"><div className="settings-item"><span className="item-icon">🆘</span><span className="item-text">Emergency Contacts</span><span className="arrow-icon">›</span></div></Link>
                </div>
            )}
            
            <button className="logout-button" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
};

export default Profile;