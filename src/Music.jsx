import { Link } from 'react-router-dom';
import './PageLayout.css';

const Music = () => (
    <div className="page-container">
        <Link to="/resources" className="back-button-link">« Back to Resources</Link>
        <h1 className="page-title">🎵 Calming Music Playlist</h1>
        
        <div className="content-card">
            <h2 className="section-heading">Music for Relaxation</h2>
            <p>Music has been scientifically proven to reduce stress and anxiety. Listening to calming music can lower your heart rate, reduce cortisol levels, and promote a sense of peace and well-being.</p>
        </div>

        <div className="content-card">
            <h2 className="section-heading">Recommended Playlist</h2>
            <p>We've curated a selection of soothing instrumental and ambient music to help you relax. Click the button below to access our recommended playlist on YouTube.</p>
            <div className="button-group" style={{ marginTop: '15px' }}>
                <a href="https://www.youtube.com/watch?v=tck7E11SdR8" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary">Listen on YouTube</button>
                </a>
            </div>
        </div>

        <div className="content-card">
            <h2 className="section-heading">Tips for Listening</h2>
            <ul style={{ paddingLeft: '20px', color: '#2D2D2D' }}>
                <li>Find a quiet, comfortable space</li>
                <li>Use headphones or speakers at a comfortable volume</li>
                <li>Close your eyes and focus on the music</li>
                <li>Let go of thoughts and just listen</li>
                <li>Listen for at least 10-15 minutes for best results</li>
                <li>Make it a regular part of your self-care routine</li>
            </ul>
        </div>

        <div className="content-card">
            <h2 className="section-heading">Other Music Resources</h2>
            <p>You can also explore music on platforms like Spotify, Apple Music, or YouTube by searching for "relaxing music," "ambient music," or "meditation music."</p>
        </div>

        <div className="button-group">
            <Link to="/resources" style={{ textDecoration: 'none' }}>
                <button className="btn-primary">Back to Resources</button>
            </Link>
        </div>
    </div>
);
export default Music;
