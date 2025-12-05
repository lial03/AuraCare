import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PageLayout.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Journaling = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState('');
    const [userName, setUserName] = useState('User');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
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
        
        setIsAnalyzing(true); // Start analysis
        setAnalysisResult(null);

        // 1. Save the journal entry
        const logResponse = await fetch(`${API_BASE_URL}/api/moodlog`, {
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
        
        if (!logResponse.ok) {
            alert('Failed to save journal entry. Check server logs.');
            setIsAnalyzing(false);
            return;
        }
        
        // 2. Perform AI analysis on the notes
        const analysisResponse = await fetch(`${API_BASE_URL}/api/analyze-journal`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ notes: notes }),
        });
        
        const analysisData = await analysisResponse.json();
        setIsAnalyzing(false);
        
        if (analysisResponse.ok) {
            setAnalysisResult(analysisData);
            // Don't navigate yet, let the user see the analysis
        } else {
            alert(`Journal entry saved, but AI analysis failed: ${analysisData.message || 'Server error'}`);
        }
    };

    const handleExit = () => {
        navigate('/journal-history');
    };

    return (
        <div className="page-container">
            <Link to="/resources" className="back-button-link">« Back to Resources</Link>
            <h1 className="page-title">📓 Gratitude Journaling</h1>
            
            <p className="page-subtitle">
                Write about things you are grateful for today. Focus on the positive and let your thoughts flow freely.
            </p>
            
            <div className="content-card">
                <h2 className="section-heading">Today's Reflection</h2>
                <textarea 
                    placeholder="Start writing here... What are you grateful for today?"
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
                        fontSize: '16px',
                        fontFamily: 'Inter, sans-serif',
                        color: '#2D2D2D',
                        resize: 'none'
                    }}
                    disabled={analysisResult} // Disable editing after saving
                ></textarea>
            </div>
            
            {/* --- Analysis Output --- */}
            {isAnalyzing && (
                <div className="content-card" style={{ textAlign: 'center', backgroundColor: '#E8F5E9', borderLeft: '5px solid #2E7D32' }}>
                    <h3 className="section-heading" style={{ marginTop: '0', marginBottom: '5px', color: '#2E7D32' }}>Analyzing Your Entry...</h3>
                    <p style={{ color: '#2E7D32' }}>The AI is generating insights. Please wait a moment.</p>
                </div>
            )}
            
            {analysisResult && (
                <div className="content-card" style={{ backgroundColor: '#E0E0FF', borderLeft: '5px solid #8B5FBF' }}>
                    <h2 className="section-heading" style={{ marginTop: '0', color: '#8B5FBF' }}>AI Entry Analysis Complete!</h2>
                    
                    <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2D2D2D', fontWeight: '600' }}>
                        Summary: <span style={{ fontWeight: '400' }}>{analysisResult.summary}</span>
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#2D2D2D', fontWeight: '600' }}>
                        Tone Detected: <span style={{ fontWeight: '400', padding: '3px 8px', backgroundColor: '#F8F8F8', borderRadius: '4px' }}>{analysisResult.tone}</span>
                    </p>
                    <p style={{ margin: '0', fontSize: '16px', color: '#2D2D2D', fontWeight: '600' }}>
                        Primary Theme: <span style={{ fontWeight: '400', padding: '3px 8px', backgroundColor: '#F8F8F8', borderRadius: '4px' }}>{analysisResult.theme}</span>
                    </p>
                    
                    <p style={{ marginTop: '15px', fontSize: '14px', color: '#6B6B6B' }}>
                        This analysis is for your reflection only. Your journal remains private.
                    </p>
                </div>
            )}


            <div className="button-group">
                {!analysisResult ? (
                    <button className="btn-primary" onClick={handleSave} disabled={isAnalyzing}>
                        {isAnalyzing ? "Saving & Analyzing..." : "Save & Analyze Entry"}
                    </button>
                ) : (
                    <button className="btn-primary" onClick={handleExit}>
                        Journal Entry Saved. Go to History »
                    </button>
                )}
                
                <Link to="/journal-history" style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary" disabled={isAnalyzing}>
                        View Past Entries
                    </button>
                </Link>
            </div>
        </div>
    );
};
export default Journaling;