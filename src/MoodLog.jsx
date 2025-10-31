import { useNavigate, useState } from 'react-router-dom';
import './MoodLog.css';

const MoodLog = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

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
        
        // Navigate back to dashboard
        navigate('/dashboard');
    };

    return (
        <div className="mood-log-container">
            <header className="log-header">
                <div className="log-header-left">
                    <span 
                        className="back-arrow"
                        onClick={() => navigate('/dashboard')}
                    >
                        ←
                    </span>
                    <h1 className="log-title">How are you feeling today?</h1>
                </div>
                <div className="user-avatar">
                    <div className="avatar-circle">L</div>
                </div>
            </header>

            {/* ... rest of your MoodLog JSX ... */}
        </div>
    );
};

export default MoodLog;