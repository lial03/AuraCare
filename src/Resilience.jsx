import { Link } from 'react-router-dom';
import './PageLayout.css';

const Resilience = () => (
    <div className="page-container">
        <Link to="/resources" className="back-button-link">« Back to Resources</Link>
        <h1 className="page-title">🎯 Building Resilience</h1>
        
        <div className="content-card">
            <h2 className="section-heading">What is Resilience?</h2>
            <p>Resilience is the ability to adapt well in the face of adversity, trauma, tragedy, threats, or significant sources of stress. It's not about avoiding challenges, but developing the strength to overcome them.</p>
        </div>

        <div className="content-card">
            <h2 className="section-heading">Key Resilience Skills</h2>
            <p><strong>Self-Awareness:</strong> Understanding your emotions and reactions helps you respond more effectively to challenges.</p>
            <p><strong>Problem-Solving:</strong> Breaking down problems into manageable steps makes them less overwhelming.</p>
            <p><strong>Social Support:</strong> Building and maintaining strong relationships provides crucial support during difficult times.</p>
            <p><strong>Optimism:</strong> Maintaining a hopeful outlook helps you see challenges as temporary and manageable.</p>
            <p><strong>Self-Care:</strong> Taking care of your physical and mental health strengthens your ability to cope.</p>
        </div>

        <div className="content-card">
            <h2 className="section-heading">Resilience-Building Practices</h2>
            <ul style={{ paddingLeft: '20px', color: '#2D2D2D' }}>
                <li>Practice mindfulness and breathing exercises daily</li>
                <li>Maintain a regular sleep schedule</li>
                <li>Exercise regularly for physical and mental health</li>
                <li>Keep a journal to process emotions</li>
                <li>Spend time with supportive people</li>
                <li>Set realistic goals and celebrate small wins</li>
                <li>Learn from past challenges and setbacks</li>
            </ul>
        </div>

        <div className="content-card">
            <h2 className="section-heading">Remember</h2>
            <p>Building resilience is a journey, not a destination. It takes time and practice. Be patient and kind with yourself as you develop these important skills.</p>
        </div>

        <div className="button-group">
            <Link to="/resources" style={{ textDecoration: 'none' }}>
                <button className="btn-primary">Back to Resources</button>
            </Link>
        </div>
    </div>
);
export default Resilience;