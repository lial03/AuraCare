import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BreathingExercise.css';

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
      <div className="back-link">
        <Link to="/dashboard">« Back to Dashboard</Link>
      </div>
      
      <div className="breathing-display">
        <div className={`breathing-circle ${phase.replace(' ', '-')}`}>
          <p className="phase-label">{phaseText[phase]}</p>
          <p className="countdown">{count}</p>
        </div>
      </div>

      <h1 className="exercise-title">4-Count Breathing</h1>
      <p className="exercise-description">
        Use this simple box breathing technique to quickly calm your nervous system.
        Focus only on the countdown.
      </p>

      <Link to="/log-mood" className="done-button-link">
        <button className="done-button">I Feel Better Now</button>
      </Link>
    </div>
  );
};

export default BreathingExercise;