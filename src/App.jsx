import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './contexts/AuthContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const WrongQuestionsPage = lazy(() => import('./pages/WrongQuestionsPage'));
const MaterialsPage = lazy(() => import('./pages/MaterialsPage'));
const ExamPage = lazy(() => import('./pages/ExamPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const PracticeResultPage = lazy(() => import('./pages/PracticeResultPage'));
const ExamResultPage = lazy(() => import('./pages/ExamResultPage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <Router>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/subject/:subjectId" element={<ProtectedRoute><SubjectPage /></ProtectedRoute>} />
        <Route path="/wrong-questions/:subjectId" element={<ProtectedRoute><WrongQuestionsPage /></ProtectedRoute>} />
        <Route path="/materials/:subjectId" element={<ProtectedRoute><MaterialsPage /></ProtectedRoute>} />
        <Route path="/exam/:examId" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        <Route path="/practice/:subjectId" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
        <Route path="/practice/:subjectId/result" element={<ProtectedRoute><PracticeResultPage /></ProtectedRoute>} />
        <Route path="/exam/:subjectId/result" element={<ProtectedRoute><ExamResultPage /></ProtectedRoute>} />
      </Routes>
    </Suspense>
    </Router>
  );
}

export default App;
