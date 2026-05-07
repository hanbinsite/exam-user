import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SubjectPage from './pages/SubjectPage';
import WrongQuestionsPage from './pages/WrongQuestionsPage';
import MaterialsPage from './pages/MaterialsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/subject/:subjectId" element={<ProtectedRoute><SubjectPage /></ProtectedRoute>} />
        <Route path="/wrong-questions/:subjectId" element={<ProtectedRoute><WrongQuestionsPage /></ProtectedRoute>} />
        <Route path="/materials/:subjectId" element={<ProtectedRoute><MaterialsPage /></ProtectedRoute>} />
        <Route path="/exam/:examId" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
