import { Link } from 'react-router-dom';
import './Dashboard.css';

const Music = () => (
    <div className="dashboard-container">
        <div className="app-header">
            <h1 className="welcome-title">🎵 Calming Music Playlist</h1>
            <div className="time-avatar">L</div> 
        </div>
        <p>This page would embed a soothing playlist (e.g., from YouTube or Spotify) to aid relaxation.</p>
        <Link to="/dashboard" className="support-button-link"><button className="support-button">Back to Dashboard</button></Link>
    </div>
);
export default Music;