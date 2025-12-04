import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Journaling = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState('');
    
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
        <div className="dashboard-container">
            <div className="app-header">
                <h1 className="welcome-title">📓 Gratitude Journaling</h1>
                <div className="time-avatar">L</div> 
            </div>
            <p>This section is where you can write about things you are grateful for today. Focus on the positive!</p>
            
            <textarea 
                placeholder={"Start writing here..."} 
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
                    marginTop: '20px',
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                }}
            ></textarea>

            <div className="support-button-link" style={{ marginTop: '20px' }}>
                <button className="support-button" onClick={handleSave}>
                    Save & Exit
                </button>
            </div>

            <Link to="/journal-history" className="support-button-link" style={{ marginTop: '10px', display: 'block', textAlign: 'center' }}>
                <button className="support-button" style={{ backgroundColor: '#A9A9A9', boxShadow: 'none' }}>
                    View Past Entries
                </button>
            </Link>
        </div>
    );
};
export default Journaling;