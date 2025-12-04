import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const JournalHistory = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken');

    const fetchJournalHistory = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/journalhistory', {
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
            const response = await fetch(`http://localhost:5000/api/moodlog/${logId}`, {
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
        <div className="dashboard-container">
            <div className="app-header">
                <h1 className="welcome-title">📓 Journal History</h1>
                <div className="time-avatar">L</div> 
            </div>

            <Link to="/resources/journaling" style={{ marginBottom: '20px', display: 'block', color: '#8B5FBF', textDecoration: 'none', fontWeight: '600' }}>
                « Write a New Entry
            </Link>
            
            {loading ? (
                <p>Loading journal entries...</p>
            ) : entries.length === 0 ? (
                <div className="data-logged-card">
                    <p>No journal entries found yet. Start writing!</p>
                </div>
            ) : (
                <div className="journal-list" style={{ width: '100%' }}>
                    {entries.map((entry) => (
                        <div key={entry._id} style={{ 
                            backgroundColor: 'white', 
                            padding: '15px', 
                            borderRadius: '16px', 
                            marginBottom: '15px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                            position: 'relative'
                        }}>
                            <h3 style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '10px' }}>
                                Saved on: {formatDate(entry.createdAt)}
                            </h3>
                            <p style={{ whiteSpace: 'pre-wrap', fontSize: '16px', color: '#2D2D2D', lineHeight: '1.5', paddingRight: '40px' }}>
                                {entry.notes}
                            </p>
                            <button
                                onClick={() => handleDeleteEntry(entry._id)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#FF6B8B',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                                aria-label="Delete entry"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <Link to="/dashboard" className="support-button-link" style={{ marginTop: '20px' }}>
                <button className="support-button">Back to Dashboard</button>
            </Link>
        </div>
    );
};

export default JournalHistory;