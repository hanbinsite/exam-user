import { useState, useEffect } from 'react';
import { get, post } from '../services/api';

export default function ExamSelector({ subjectId, onStart }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(null);

  useEffect(() => {
    get(`/subjects/${subjectId}/exams`)
      .then((data) => setExams(data.items || data || []))
      .catch((err) => setError(err.message || '加载考试列表失败'))
      .finally(() => setLoading(false));
  }, [subjectId]);

  const handleStart = async (examId) => {
    setStarting(examId);
    try {
      const session = await post(`/exams/${examId}/start`);
      onStart(session);
    } catch (err) {
      setError(err.message || '开始考试失败');
    } finally {
      setStarting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          重试
        </button>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500">该科目暂无可用的考试</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {exams.map((exam) => (
        <div
          key={exam.id}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                考
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{exam.name}</h3>
                {exam.description && (
                  <p className="text-sm text-gray-500">{exam.description}</p>
                )}
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  {exam.duration && (
                    <span>时长: {exam.duration} 分钟</span>
                  )}
                  {exam.question_count && (
                    <span>{exam.question_count} 题</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleStart(exam.id)}
              disabled={starting === exam.id}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            >
              {starting === exam.id && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              开始考试
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
