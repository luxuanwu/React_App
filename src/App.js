import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Player from './components/Player';
import TrackDetail from './components/TrackDetail';

// 创建一个包装组件来访问location
function AppContent() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player" element={isLoggedIn ? <Player /> : <Navigate to="/login?redirect=/player" />} />
        <Route path="/track/:id" element={isLoggedIn ? <TrackDetail /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
