import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PageLayout.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const MoodHistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('User');
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchUserName = async () => {
            const userId = localStorage.getItem('currentUserId');
            
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
    }, [token]);

    const fetchMoodHistory = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/moodhistory`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Error fetching mood history:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchMoodHistory();
    }, [token]);

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getMoodColor = (mood) => {
        const colors = {
            'Terrible': '#A34747',
            'Down': '#D97E7E',
            'Okay': '#8B5FBF',
            'Mixed': '#8B5FBF',
            'Good': '#7CB342',
            'Amazing': '#FFC107'
        };
        return colors[mood] || '#8B5FBF';
    };

    const getMoodEmoji = (mood) => {
        const emojis = {
            'Terrible': '😬',
            'Down': '😞',
            'Okay': '😐',
            'Mixed': '☯️',
            'Good': '😊',
            'Amazing': '🤩'
        };
        return emojis[mood] || '😐';
    };

    return (
        <div className="page-container">
            <Link to="/dashboard" className="back-button-link">« Back to Dashboard</Link>
            <h1 className="page-title">📊 Recent Moods & Notes</h1>

            <p className="page-subtitle">
                View your mood history and the notes you've recorded
            </p>

            <div className="button-group" style={{ marginBottom: '30px' }}>
                <Link to="/log-mood" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary">Log New Mood</button>
                </Link>
            </div>
            
            {loading ? (
                <div className="content-card">
                    <p style={{ textAlign: 'center', color: '#6B6B6B' }}>Loading mood history...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="content-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">📈</div>
                        <p className="empty-state-text">No mood entries found yet. Start tracking your mood to see your patterns!</p>
                    </div>
                </div>
            ) : (
                <div className="mood-log-list" style={{ marginTop: '20px' }}>
                    {history.map((log, index) => (
                        <div 
                            key={index}
                            className="content-card"
                            style={{
                                borderLeft: `5px solid ${getMoodColor(log.mood)}`,
                                paddingLeft: '20px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <span style={{ fontSize: '24px' }}>{getMoodEmoji(log.mood)}</span>
                                <div style={{ flexGrow: 1 }}>
                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#2D2D2D' }}>
                                        {log.mood}
                                    </p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#6B6B6B' }}>
                                        {formatDate(log.createdAt)}
                                    </p>
                                </div>
                            </div>
                            {log.notes && (
                                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#2D2D2D', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                    <strong>Notes:</strong> {log.notes}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="button-group" style={{ marginTop: '30px' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary">Back to Dashboard</button>
                </Link>
            </div>
        </div>
    );
};

export default MoodHistoryPage;