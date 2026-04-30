import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ExamProvider } from '../contexts/ExamContext';
import { get } from '../services/api';
import { adaptQuestion } from '../services/adapter';
import StatsCard from '../components/StatsCard';
import ChoiceQuestion from '../components/ChoiceQuestion';
import JudgmentQuestion from '../components/JudgmentQuestion';
import ExamSelector from '../components/ExamSelector';

async function loadAllQuestions(subjectId, mode, sessionId) {
  let allQuestions = [];
  let page = 1;
  const pageSize = 100;
  while (true) {
    let params = `mode=${mode}&page=${page}&pageSize=${pageSize}`;
    if (sessionId) params += `&session_id=${sessionId}`;
    const res = await get(`/subjects/${subjectId}/questions?${params}`);
    allQuestions = allQuestions.concat(res.questions || []);
    if (allQuestions.length >= res.total) break;
    page++;
  }
  return allQuestions.map(adaptQuestion);
}

export default function SubjectPage() {
  const { subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'study';

  const [phase, setPhase] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [examSession, setExamSession] = useState(null);

  const effectiveMode = examSession ? 'exam' : mode;

  const fetchQuestions = useCallback(async (m, sessionId) => {
    setPhase('loading');
    setError('');
    try {
      const qs = await loadAllQuestions(subjectId, m, sessionId);
      setQuestions(qs);
      setPhase('ready');
    } catch (err) {
      setError(err.message || '加载题目失败');
      setPhase('error');
    }
  }, [subjectId]);

  useEffect(() => {
    if (mode === 'exam') {
      setPhase('exam-select');
    } else {
      setExamSession(null);
      fetchQuestions(mode);
    }
  }, [subjectId, mode, fetchQuestions]);

  useEffect(() => {
    get(`/subjects/${subjectId}`)
      .then(setSubjectInfo)
      .catch(() => {});
  }, [subjectId]);

  const handleExamStart = useCallback(async (session) => {
    setExamSession(session);
    await fetchQuestions('exam', session.session_id);
  }, [fetchQuestions]);

  const choiceQuestions = questions.filter(q => q.__type === 'choice');
  const judgmentQuestions = questions.filter(q => q.__type === 'judgment');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </button>
          <h1 className="text-3xl font-bold mb-2">
            {subjectInfo?.name || '加载中...'}
          </h1>
          <p className="text-white/80">
            {mode === 'study' && '学习模式 · 答题后查看解析'}
            {mode === 'practice' && '练习模式 · 自测检验'}
            {mode === 'exam' && !examSession && '考试模式 · 请选择题库'}
            {mode === 'exam' && examSession && `考试模式 · ${examSession.exam_config?.name || ''}`}
          </p>
          {examSession && (
            <div className="flex gap-4 mt-3 text-sm text-white/70">
              <span>共 {examSession.question_count} 题</span>
              {examSession.expires_at && (
                <span>截止: {new Date(examSession.expires_at).toLocaleString()}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Exam selection phase */}
        {phase === 'exam-select' && (
          <ExamSelector subjectId={subjectId} onStart={handleExamStart} />
        )}

        {/* Loading */}
        {phase === 'loading' && (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {phase === 'error' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchQuestions(effectiveMode, examSession?.session_id)}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              重试
            </button>
          </div>
        )}

        {/* Questions */}
        {phase === 'ready' && (
          <ExamProvider
            questions={questions}
            mode={effectiveMode}
            subjectId={subjectId}
            examSessionId={examSession?.session_id}
          >
            {effectiveMode !== 'study' && <StatsCard />}

            {choiceQuestions.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">
                    选
                  </span>
                  <span>选择题</span>
                  <span className="text-sm font-normal text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                    {choiceQuestions.length} 题
                  </span>
                </h2>
                {choiceQuestions.map((q, idx) => (
                  <ChoiceQuestion key={q.id} question={q} index={idx} />
                ))}
              </section>
            )}

            {judgmentQuestions.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">
                    判
                  </span>
                  <span>判断题</span>
                  <span className="text-sm font-normal text-gray-500 bg-purple-100 px-3 py-1 rounded-full">
                    {judgmentQuestions.length} 题
                  </span>
                </h2>
                {judgmentQuestions.map((q, idx) => (
                  <JudgmentQuestion key={q.id} question={q} index={idx} />
                ))}
              </section>
            )}

            <div className="text-center py-8">
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-white border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 rounded-xl transition-all shadow-md"
              >
                返回首页
              </button>
            </div>
          </ExamProvider>
        )}
      </div>
    </div>
  );
}
