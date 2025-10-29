import { useState } from 'react';
import './MoodLog.css';

const MoodLog = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [notes, setNotes] = useState('');

    const moodOptions = [
        { icon: '😄', label: 'Amazing', color: '#4CAF82' },
        { icon: '🙂', label: 'Good', color: '#8B5FBF' },
        { icon: '😐', label: 'Neutral', color: '#FFD95A' },
        { icon: '😟', label: 'Down', color: '#FFA726' },
        { icon: '😭', label: 'Terrible', color: '#FF6B8B' },
    ];

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
    };

    const handleSaveMood = () => {
        if (!selectedMood) {
            alert('Please select a mood first!');
            return;
        }
        
        // Here we'll later save to backend
        console.log('Saving mood:', {
            mood: selectedMood,
            notes: notes,
            timestamp: new Date().toISOString()
        });
        
        alert(`Mood logged: ${selectedMood.label} 🎉`);
        
        // Reset form
        setSelectedMood(null);
        setNotes('');
    };

    return (
        <div className="mood-log-container">
            <header className="log-header">
                <div className="log-header-left">
                    <span className="back-arrow">←</span>
                    <h1 className="log-title">How are you feeling today?</h1>
                </div>
                <div className="user-avatar">
                    <div className="avatar-circle">L</div>
                </div>
            </header>

            <div className="mood-selection-section">
                <p className="section-prompt">Select your current mood:</p>
                <div className="mood-grid">
                    {moodOptions.map((mood) => (
                        <div 
                            key={mood.label} 
                            className={`mood-option ${selectedMood?.label === mood.label ? 'selected' : ''}`}
                            style={{
                                backgroundColor: selectedMood?.label === mood.label ? `${mood.color}20` : 'transparent',
                                border: selectedMood?.label === mood.label ? `2px solid ${mood.color}` : '2px solid transparent'
                            }}
                            onClick={() => handleMoodSelect(mood)}
                        >
                            <span className="mood-icon">{mood.icon}</span>
                            <span className="mood-label">{mood.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="notes-section">
                <p className="section-prompt">What's on your mind? (Optional)</p>
                <textarea
                    className="mood-notes-textarea"
                    placeholder="Write down any triggers, thoughts, or observations from today..."
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
            </div>
            
            <div className="action-button-group">
                <button 
                    className="log-mood-button"
                    onClick={handleSaveMood}
                    style={{
                        backgroundColor: selectedMood ? selectedMood.color : '#A06FC7',
                        opacity: selectedMood ? 1 : 0.7
                    }}
                >
                    {selectedMood ? `Save ${selectedMood.label} Mood` : 'Save How I Feel'}
                </button>
            </div>
        </div>
    );
};

export default MoodLog;