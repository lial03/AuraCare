import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Onboarding from './Onboarding';
import SignUp from './SignUp';

function App(){
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Onboarding />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
