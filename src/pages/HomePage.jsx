import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { get } from '../services/api';

const MODES = [
  { key: 'materials', label: '资料', icon: '📘', bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700', isLink: true },
  { key: 'study', label: '学习', icon: '📖', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  { key: 'practice', label: '练习', icon: '✏️', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  { key: 'exam', label: '考试', icon: '📝', color: 'from-orange-500 to-red-500', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
];

export default function HomePage() {
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    get('/auth/my-subjects')
      .then(async ({ subject_ids }) => {
        if (!subject_ids || subject_ids.length === 0) return [];
        const results = await Promise.allSettled(
          subject_ids.map((id) => get(`/subjects/${id}`))
        );
        return results.filter(r => r.status === 'fulfilled').map(r => r.value);
      })
      .then(setSubjects)
      .catch((err) => setError(err.message || '加载失败'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            B-Exam
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            在线考试系统
          </h2>
          <p className="text-gray-600 text-lg">选择题库开始答题，支持自动保存答题进度</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
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
        )}

        {!loading && !error && (
          <div className="grid gap-6">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform shadow-lg">
                      {subject.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-gray-500 text-sm truncate">{subject.description}</p>
                    </div>
                    <Link
                      to={`/wrong-questions/${subject.id}`}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      错题集
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-5">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      {subject.stats?.totalQuestions || 0} 题
                    </span>
                    {subject.stats?.totalExams > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {subject.stats.totalExams} 场考试
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {MODES.map((m) => (
                      <Link
                        key={m.key}
                        to={m.isLink ? `/materials/${subject.id}` : `/subject/${subject.id}?mode=${m.key}`}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border ${m.bg} ${m.text} font-medium hover:shadow-md transition-all`}
                      >
                        <span>{m.icon}</span>
                        <span>{m.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && subjects.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500">暂无可用的科目</p>
          </div>
        )}

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>支持学习、练习、考试三种模式</p>
          <p className="mt-1">答题进度自动保存至本地浏览器</p>
        </div>
      </div>
    </div>
  );
}
