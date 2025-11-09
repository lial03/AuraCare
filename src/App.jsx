import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import EmergencyNotification from './EmergencyNotification';
import Login from './Login';
import MoodLog from './MoodLog';
import Onboarding from './Onboarding';
import PrivateRoute from './PrivateRoute';
import Profile from './Profile';
import Resources from './Resources';
import SignUp from './SignUp';
import SupportCircle from './SupportCircle';

const AppRoutes = () => {
    const location = useLocation();

    return (
        <Routes>
            {/* 1. Public Routes */}
            <Route path="/" element={<Onboarding />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            
            {/* 2. Private Routes (Protected by JWT) */}
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard key={location.key} />} />
                <Route path="/log-mood" element={<MoodLog />} />
                <Route path="/support-circle" element={<SupportCircle />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/help-on-way" element={<EmergencyNotification />} />
                <Route path="/notifications" element={<h1>Notifications Setting</h1>} />
                <Route path="/privacy" element={<h1>Privacy & Security Setting</h1>} />
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