import { Link } from 'react-router-dom';
import './Dashboard.css';

const MentalHealth = () => (
    <div className="dashboard-container">
        <div className="app-header">
            <h1 className="welcome-title">📚 Understanding Mental Health</h1>
            <div className="time-avatar">L</div> 
        </div>
        <p>Learn about common mental health conditions, symptoms, and when to seek professional help. Knowledge is the first step toward self-care.</p>
        <Link to="/resources" className="support-button-link"><button className="support-button">Back to Resources</button></Link>
    </div>
);
export default MentalHealth;