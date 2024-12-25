import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignUp from './components/Authentication/SingUp';
import SignIn from './components/Authentication/SignIn';

function App() {
  return (
   
      <Router>
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </Router>
  
  );
}

export default App;
