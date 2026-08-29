import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<div>AEGIS Security System</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
