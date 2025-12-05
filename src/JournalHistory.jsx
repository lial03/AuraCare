import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PageLayout.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const JournalHistory = () => {
    const [entries, setEntries] = useState([]);
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

    const fetchJournalHistory = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/journalhistory`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setEntries(data);
            }
        } catch (error) {
            console.error('Error fetching journal history:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchJournalHistory();
    }, [token]);

    const handleDeleteEntry = async (logId) => {
        if (!window.confirm("Are you sure you want to permanently delete this journal entry?")) {
            return;
        }
        
        if (!token) {
            alert('Session expired. Please log in.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/moodlog/${logId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Journal entry deleted successfully!');
                setEntries(prevEntries => prevEntries.filter(entry => entry._id !== logId));
            } else {
                const errorData = await response.json();
                alert(`Failed to delete entry: ${errorData.message || 'Server Error'}`);
            }
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="page-container">
            <Link to="/resources" className="back-button-link">« Back to Resources</Link>
            <h1 className="page-title">📓 Journal History</h1>

            <p className="page-subtitle">
                View and manage your past journal entries
            </p>

            <div className="button-group" style={{ marginBottom: '30px' }}>
                <Link to="/resources/journaling" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary">Write a New Entry</button>
                </Link>
            </div>
            
            {loading ? (
                <div className="content-card">
                    <p style={{ textAlign: 'center', color: '#6B6B6B' }}>Loading journal entries...</p>
                </div>
            ) : entries.length === 0 ? (
                <div className="content-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <p className="empty-state-text">No journal entries found yet. Start writing to begin your reflection journey!</p>
                    </div>
                </div>
            ) : (
                <div className="journal-list" style={{ width: '100%' }}>
                    {entries.map((entry) => (
                        <div key={entry._id} className="content-card" style={{ position: 'relative', paddingRight: '50px' }}>
                            <h3 style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '10px', marginTop: '0' }}>
                                📅 {formatDate(entry.createdAt)}
                            </h3>
                            <p style={{ whiteSpace: 'pre-wrap', fontSize: '16px', color: '#2D2D2D', lineHeight: '1.6', margin: '0' }}>
                                {entry.notes}
                            </p>
                            <button
                                onClick={() => handleDeleteEntry(entry._id)}
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '15px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#FF6B8B',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    padding: '0',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                aria-label="Delete entry"
                                title="Delete entry"
                            >
                                ✕
                            </button>
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

export default JournalHistory;
