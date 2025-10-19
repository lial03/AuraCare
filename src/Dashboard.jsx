import './Dashboard.css';

const Dashboard=() =>{
    return (
        <div className="dashbaord-container">
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1 className="welcome-title">Hello, Lina! 👋</h1>
                    <p className="welcome-subtitle">How are you feeling today?</p>
                </div>
                <div className="user-avatar">
                    <div className="avatar-circle">L</div>
                </div>
            </div>

            <div className="mood-section">
                <h2 className="section-title">Your Mood This Week</h2>
                <div className="mood-chart">
                    <div className="chart-placeholder">
                        📊 Mood Chart - Recharts will go here
                    </div>
                </div>
            </div>

            <div className="insights-card">
                <div className="insights-header">
                    <span className="insights-icon">💡</span>
                    <h3>This Week's Insight</h3>
                </div>
                <p className="insights-text">
                    You feel 40% better on days with morning walks. Try starting your day with a short walk! 🚶‍♀️
                </p>
            </div>

            <div className="support-section">
                <button className="support-button">
                    <span className="support-icon">🆘</span>
                    I Need Support Now
                </button>
                <div className="pulse-indicator">. . .</div>
            </div>

            <div className="quick-actions">
                <h2 className="section-title">Quick Actions</h2>
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

            <div className="bottom-nav">
                <div className="nav-item active">
                    <span className="nav-icon">🏠</span>
                    <span className="nav-text">Home</span>
                </div>
                <div className="nav-item">
                    <span className="nav-icon">💡</span>
                    <span className="nav-text">Resources</span>
                </div>
                <div className="nav-item">
                    <span className="nav-icon">👤</span>
                    <span className="nav-text">Profile</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;