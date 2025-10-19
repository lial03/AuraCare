import './Dashboard.css';

const Dashboard=() =>{
    return (
        <div className="dashboard-container">
            
            <div className="dashboard-header">
                <h1 className="welcome-title">Hello Lina! 👋</h1>
                <div className="user-avatar">
                    <div className="avatar-circle">L</div>
                </div>
            </div>

            <div className="mood-section">
                <div className="mood-chart-placeholder">
                    No data logged
                </div>
            </div>

            {/* Insight Card 1: This Week's Insight */}
            <div className="insights-card insights-card-1">
                <p className="insights-content">
                    <span className="insights-icon">📈</span> This Week's Insight<br/>
                    You feel 40% better on days with morning walks
                    <span className="insights-emoji"> 🚶</span>
                </p>
            </div>

            {/* Insight Card 2: Your Pattern */}
            <div className="insights-card insights-card-2">
                <p className="insights-content">
                    <span className="insights-icon">🎯</span> Your Pattern: Mood dips around 3 PM. Try a 5-minute break!
                </p>
            </div>

            <div className="support-section">
                <button className="support-button">
                    I Need Support Now
                </button>
            </div>

            <h2 className="section-title">Quick Actions</h2>
            
            <div className="quick-actions">
                <div className="actions-grid">
                    <div className="action-card">
                        <div className="action-icon">📝</div>
                        <span className="action-text">Log My Mood</span>
                    </div>
                    <div className="action-card">
                        <div className="action-icon">👥</div>
                        <span className="action-text">My Support Circle</span>
                    </div>
                    <div className="action-card">
                        <div className="action-icon">💡</div>
                        <span className="action-text">Resources</span>
                    </div>
                    <div className="action-card">
                        <div className="action-icon">⚙️</div>
                        <span className="action-text">My Profile</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;