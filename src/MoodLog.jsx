import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MoodLog.css';

const MoodLog = () => {
    const navigate = useNavigate();
    const [selectedMood, setSelectedMood] = useState('');
    const [notes, setNotes] = useState('');

    const moodOptions = [
        { emoji: '😬', label: 'Terrible' }, 
        { emoji: '😞', label: 'Down' },
        { emoji: '😐', label: 'Okay' },
        { emoji: '😊', label: 'Good' },
        { emoji: '🤩', label: 'Amazing' }, 
        { emoji: '☯️', label: 'Mixed' },
    ];
    
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

        try {
            const response = await fetch('http://localhost:5000/api/moodlog', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mood: selectedMood, notes }),
            });

            if (response.ok) {
                alert('Mood logged successfully!');
                navigate('/dashboard'); 
            } else {
                alert('Failed to save mood. Check server logs.');
            }
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    return (
        <div className="mood-log-container">
            <header className="log-header">
                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#8B5FBF', fontWeight: '600', fontSize: '16px', lineHeight: '1', position: 'absolute', left: '20px' }}>
                    « Back
                </Link>
                <h1 className="log-title">How are you feeling today?</h1>
                <div className="time-avatar">L</div> 
            </header>

            <div className="mood-selection-section">
                <p className="section-prompt">Select your current mood:</p>
                <div className="mood-grid">
                    {moodOptions.map((mood) => (
                        <div 
                            key={mood.label} 
                            className={`mood-option ${selectedMood === mood.label ? 'selected' : ''}`}
                            onClick={() => setSelectedMood(mood.label)}
                        >
                            <span className="mood-icon">{mood.emoji}</span>
                            <span className="mood-label">{mood.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="notes-section">
                <textarea
                    className="mood-notes-textarea"
                    placeholder="Any notes? (Optional)" 
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
            </div>
            
            <div className="action-button-group">
                <button className="log-mood-button" onClick={handleSave}>
                    Save How I Feel
                </button>
            </div>
        </div>
    );
};

export default MoodLog;