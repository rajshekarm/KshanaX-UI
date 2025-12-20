import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import SmartBlotter from '@/pages/SmartBlotter';

// Correctly declare the component before exporting
const App = () => {
  return (
    <Router>
      {/* Cleaned the className string of those box characters */}
      <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/smart-blotter" element={<SmartBlotter />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;