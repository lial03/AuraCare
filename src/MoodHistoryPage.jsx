import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../src/Dashboard.css';

const MoodHistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken');

    const fetchMoodHistory = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/moodhistory', {
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

    return (
        <div className="dashboard-container">
            <div className="app-header">
                {/* Back link is anchored left by position: absolute */}
                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#8B5FBF', fontWeight: '600', fontSize: '16px', lineHeight: '1', position: 'absolute', left: '20px' }}>
                    « Back
                </Link>
                {/* Title is centered by position: absolute and transform */}
                <h1 className="screen-title" style={{ maxWidth: '65%', fontSize: '24px' }}>Recent Moods & Notes</h1>
                {/* Avatar is anchored right by position: absolute */}
                <div className="time-avatar">L</div>
            </div>
            
            {loading ? (
                <p>Loading mood history...</p>
            ) : history.length === 0 ? (
                <div className="data-logged-card" style={{ height: '150px' }}>
                    <p>No mood entries found.</p>
                </div>
            ) : (
                <div className="mood-log-list" style={{ marginTop: '20px' }}>
                    {history.map((log, index) => (
                        <div key={index} className="insight-card-1" style={{ borderLeft: `5px solid ${log.mood === 'Terrible' ? '#A34747' : '#8B5FBF'}`, marginBottom: '15px', padding: '15px' }}>
                            <div style={{ flexGrow: 1 }}>
                                <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#2D2D2D' }}>
                                    Mood: {log.mood}
                                </p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#6B6B6B' }}>
                                    {formatDate(log.createdAt)}
                                </p>
                                {log.notes && (
                                    <p style={{ margin: '10px 0 0 0', fontStyle: 'italic', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                                        Notes: {log.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="action-button-group" style={{ marginTop: '30px' }}>
                <button className="log-mood-button" onClick={() => navigate('/log-mood')}>
                    Log New Mood
                </button>
            </div>
        </div>
    );
};

export default MoodHistoryPage;