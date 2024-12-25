import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/Authentication/SignIn';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/login" element={<Dashboard />} />
    </Routes>
  </Router>

  );
}

export default App;