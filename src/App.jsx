import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import BreathingExercise from './BreathingExercise';
import Dashboard from './Dashboard';
import EmergencyNotification from './EmergencyNotification';
import JournalHistory from './JournalHistory';
import Journaling from './Journaling';
import Login from './Login';
import MentalHealth from './MentalHealth';
import MoodHistoryPage from './MoodHistoryPage';
import MoodLog from './MoodLog';
import Music from './Music';
import NotificationSettings from './NotificationSettings';
import Onboarding from './Onboarding';
import PrivacySettings from './PrivacySettings';
import PrivateRoute from './PrivateRoute';
import Profile from './Profile';
import Resilience from './Resilience';
import Resources from './Resources';
import SignUp from './SignUp';
import SupportCircle from './SupportCircle';

const AppRoutes = () => {
    const location = useLocation();

    return (
        <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard key={location.key} />} />
                <Route path="/log-mood" element={<MoodLog />} />
                <Route path="/support-circle" element={<SupportCircle />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/help-on-way" element={<EmergencyNotification />} />
                
                <Route path="/breathing-exercise" element={<BreathingExercise />} />
                <Route path="/resources/music" element={<Music />} />
                <Route path="/resources/journaling" element={<Journaling />} />
                <Route path="/resources/mental-health" element={<MentalHealth />} />
                <Route path="/resources/resilience" element={<Resilience />} />
                <Route path="/journal-history" element={<JournalHistory />} />
                <Route path="/mood-history" element={<MoodHistoryPage />} />
                
                <Route path="/notifications" element={<NotificationSettings />} />
                <Route path="/privacy" element={<PrivacySettings />} />
            </Route>
        </Routes>
    );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;