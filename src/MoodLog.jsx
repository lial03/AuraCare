import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MoodLog.css';
import './PageLayout.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const MoodLog = () => {
    const navigate = useNavigate();
    const [selectedMood, setSelectedMood] = useState('');
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

    const moodOptions = [
        { emoji: '😬', label: 'Terrible' }, 
        { emoji: '😞', label: 'Down' },
        { emoji: '😐', label: 'Okay' },
        { emoji: '😊', label: 'Good' },
        { emoji: '🤩', label: 'Amazing' }, 
        { emoji: '☯️', label: 'Mixed' },
    ];
    
    const handleSelectMood = (label) => {
        setSelectedMood(label);
        
        if (label === 'Mixed') {
            setNotes("I feel mixed because:\n\nGood thing 1: \nBad thing 1: \n\nI need to focus on:");
        } else if (selectedMood === 'Mixed') {
            setNotes('');
        }
    };
    
    const handleSave = async () => {
        if (!selectedMood) {
            alert('Please select your current mood.');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Session expired. Please log in.');
            navigate('/login');
            return;
        }
        
        const moodToSave = selectedMood === 'Mixed' ? 'Journal Entry' : selectedMood;

        try {
            const response = await fetch(`${API_BASE_URL}/api/moodlog`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mood: moodToSave, notes }),
            });

            if (response.ok) {
                alert('Mood logged successfully!');
                
                if (selectedMood === 'Mixed') {
                    navigate('/resources/journaling');
                } else {
                    navigate('/dashboard'); 
                }
            } else {
                alert('Failed to save mood. Check server logs.');
            }
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    return (
        <div className="mood-log-container">
            <Link to="/dashboard" className="back-button-link">« Back to Dashboard</Link>
            <h1 className="page-title" style={{ marginBottom: '30px', textAlign: 'center' }}>
                How are you feeling today?
            </h1>

            <div className="mood-selection-section">
                <p className="section-prompt">Select your current mood:</p>
                <div className="mood-grid">
                    {moodOptions.map((mood) => (
                        <div 
                            key={mood.label} 
                            className={`mood-option ${selectedMood === mood.label ? 'selected' : ''}`}
                            onClick={() => handleSelectMood(mood.label)}
                        >
                            <span className="mood-icon">{mood.emoji}</span>
                            <span className="mood-label">{mood.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="notes-section">
                <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '10px' }}>
                    {selectedMood === 'Mixed' ? 'Use the prompt above to guide your thoughts.' : 'Add any notes (optional)'}
                </p>
                <textarea
                    className="mood-notes-textarea"
                    placeholder={selectedMood === 'Mixed' ? "Use the prompt above to guide your thoughts." : "Any notes? (Optional)"} 
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
            </div>
            
            <div className="button-group">
                <button className="btn-primary" onClick={handleSave}>
                    {selectedMood === 'Mixed' ? "Save Reflection" : "Save How I Feel"}
                </button>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary">Cancel</button>
                </Link>
            </div>
        </div>
    );
};

export default MoodLog;
