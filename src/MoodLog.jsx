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
    
    // --- Handle Mood Selection with Guided Prompt ---
    const handleSelectMood = (label) => {
        setSelectedMood(label);
        
        if (label === 'Mixed') {
            setNotes("I feel mixed because:\n\nGood thing 1: \nBad thing 1: \n\nI need to focus on:");
        } else if (selectedMood === 'Mixed') {
            // Clear prompt if switching away from Mixed
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
        
        // Determine if it should be saved as a Journal Entry
        const moodToSave = selectedMood === 'Mixed' ? 'Journal Entry' : selectedMood;

        try {
            const response = await fetch('http://localhost:5000/api/moodlog', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mood: moodToSave, notes }),
            });

            if (response.ok) {
                alert('Mood logged successfully!');
                
                // If it was a Mixed entry, guide them toward reflection
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
                            onClick={() => handleSelectMood(mood.label)} // Use new handler
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
                    placeholder={selectedMood === 'Mixed' ? "Use the prompt above to guide your thoughts." : "Any notes? (Optional)"} 
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
            </div>
            
            <div className="action-button-group">
                <button className="log-mood-button" onClick={handleSave}>
                    {selectedMood === 'Mixed' ? "Save Reflection" : "Save How I Feel"}
                </button>
            </div>
        </div>
    );
};

export default MoodLog;