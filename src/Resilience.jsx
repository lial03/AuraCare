import { Link } from 'react-router-dom';
import './Dashboard.css';

const Resilience = () => (
    <div className="dashboard-container">
        <div className="app-header">
            <h1 className="welcome-title">🎯 Building Resilience</h1>
            <div className="time-avatar">L</div> 
        </div>
        <p>Resilience is the process of adapting well in the face of adversity, trauma, tragedy, threats, or even significant sources of stress. Here you can find tips and exercises to strengthen your coping skills.</p>
        <Link to="/resources" className="support-button-link"><button className="support-button">Back to Resources</button></Link>
    </div>
);
export default Resilience;