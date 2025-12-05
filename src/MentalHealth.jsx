import { Link } from 'react-router-dom';
import './PageLayout.css';

const MentalHealth = () => (
    <div className="page-container">
        <Link to="/resources" className="back-button-link">« Back to Resources</Link>
        <h1 className="page-title">📚 Understanding Mental Health</h1>
        
        <div className="content-card">
            <h2 className="section-heading">What is Mental Health?</h2>
            <p>Mental health includes our emotional, psychological, and social well-being. It affects how we think, feel, and act in daily life. Mental health is important at every stage of life, from childhood and adolescence through adulthood.</p>
        </div>

        <div className="content-card">
            <h2 className="section-heading">Common Mental Health Conditions</h2>
            <p><strong>Anxiety Disorders:</strong> Persistent worry, panic attacks, and fear that interfere with daily activities.</p>
            <p><strong>Depression:</strong> Persistent sadness, loss of interest in activities, and feelings of hopelessness.</p>
            <p><strong>Stress:</strong> A natural response to challenges, but chronic stress can affect your health.</p>
            <p><strong>Sleep Issues:</strong> Difficulty sleeping can both result from and contribute to mental health challenges.</p>
        </div>

        <div className="content-card">
            <h2 className="section-heading">When to Seek Help</h2>
            <p>Consider reaching out to a mental health professional if you experience:</p>
            <ul style={{ paddingLeft: '20px', color: '#2D2D2D' }}>
                <li>Persistent sadness or anxiety lasting more than two weeks</li>
                <li>Difficulty concentrating or making decisions</li>
                <li>Changes in sleep or appetite</li>
                <li>Withdrawal from friends and activities</li>
                <li>Thoughts of self-harm or suicide</li>
            </ul>
        </div>

        <div className="content-card">
            <h2 className="section-heading">Crisis Helpline</h2>
            <p><strong>National Suicide Prevention Lifeline: 1-800-273-8255</strong></p>
            <p>Available 24/7. Free and confidential. You're not alone.</p>
        </div>

        <div className="button-group">
            <Link to="/resources" style={{ textDecoration: 'none' }}>
                <button className="btn-primary">Back to Resources</button>
            </Link>
        </div>
    </div>
);
export default MentalHealth;