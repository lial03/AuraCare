import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BreathingExercise.css';
import './PageLayout.css';

const BreathingExercise = () => {
  const [phase, setPhase] = useState('breathe in');
  const [count, setCount] = useState(4);
  const totalTime = 4;

  useEffect(() => {
    let timer;

    const runExercise = (currentPhase) => {
        let nextPhase;
        let duration;

        if (currentPhase === 'breathe in') {
            nextPhase = 'hold';
            duration = 4;
        } else if (currentPhase === 'hold') {
            nextPhase = 'breathe out';
            duration = 4;
        } else if (currentPhase === 'breathe out') {
            nextPhase = 'hold out';
            duration = 4;
        } else {
            nextPhase = 'breathe in';
            duration = 4;
        }
        
        setPhase(currentPhase);
        setCount(duration);

        timer = setInterval(() => {
            setCount(prevCount => {
                if (prevCount === 1) {
                    clearInterval(timer);
                    runExercise(nextPhase); 
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);
    };

    runExercise('breathe in');

    return () => clearInterval(timer);
  }, []);

  const phaseText = {
    'breathe in': 'Breathe In...',
    'hold': 'Hold',
    'breathe out': 'Breathe Out...',
    'hold out': 'Hold Out'
  };

  return (
    <div className="breathing-exercise-container">
      <Link to="/dashboard" className="back-button-link" style={{ marginBottom: '20px' }}>
        « Back to Dashboard
      </Link>
      
      <h1 className="page-title" style={{ marginBottom: '30px', textAlign: 'center' }}>
        🌿 4-Count Breathing Exercise
      </h1>

      <div className="breathing-display">
        <div className={`breathing-circle ${phase.replace(' ', '-')}`}>
          <p className="phase-label">{phaseText[phase]}</p>
          <p className="countdown">{count}</p>
        </div>
      </div>

      <p className="exercise-description">
        Use this simple box breathing technique to quickly calm your nervous system. Focus only on the countdown and follow your breath.
      </p>

      <div className="button-group" style={{ marginTop: '40px' }}>
        <Link to="/log-mood" style={{ textDecoration: 'none' }}>
          <button className="btn-primary">I Feel Better Now</button>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary">Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default BreathingExercise;
