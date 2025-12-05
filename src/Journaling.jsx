import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PageLayout.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Journaling = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState('');
    const [userName, setUserName] = useState('User');
    
    useEffect(() => {
        const fetchUserName = async () => {
            const userId = localStorage.getItem('currentUserId');
            const token = localStorage.getItem('authToken');
            
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
    }, []);
    
    const handleSave = async () => {
        if (!notes.trim()) {
            alert('Please write something before saving your journal entry.');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Session expired. Please log in.');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/moodlog`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    mood: 'Journal Entry',
                    notes: notes 
                }),
            });

            if (response.ok) {
                alert('Journal entry saved successfully! View it in Past Entries.');
                navigate('/journal-history');
            } else {
                alert('Failed to save journal entry. Check server logs.');
            }
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    return (
        <div className="page-container">
            <Link to="/resources" className="back-button-link">« Back to Resources</Link>
            <h1 className="page-title">📓 Gratitude Journaling</h1>
            
            <p className="page-subtitle">
                Write about things you are grateful for today. Focus on the positive and let your thoughts flow freely.
            </p>
            
            <div className="content-card">
                <h2 className="section-heading">Today's Reflection</h2>
                <textarea 
                    placeholder="Start writing here... What are you grateful for today?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ 
                        width: '100%', 
                        height: '250px', 
                        padding: '15px', 
                        borderRadius: '12px', 
                        border: '1px solid #E8E8E8',
                        backgroundColor: '#F8F8F8',
                        boxSizing: 'border-box',
                        fontSize: '16px',
                        fontFamily: 'Inter, sans-serif',
                        color: '#2D2D2D',
                        resize: 'none'
                    }}
                ></textarea>
            </div>

            <div className="button-group">
                <button className="btn-primary" onClick={handleSave}>
                    Save & Exit
                </button>
                <Link to="/journal-history" style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary">
                        View Past Entries
                    </button>
                </Link>
            </div>
        </div>
    );
};
export default Journaling;
