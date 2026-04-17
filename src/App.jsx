import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import ExamPage from './pages/ExamPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn/:examId" element={<LearnPage />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
      </Routes>
    </Router>
  );
}

export default App;
