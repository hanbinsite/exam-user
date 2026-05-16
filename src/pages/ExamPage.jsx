import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExamProvider, useExam } from '../contexts/ExamContext';
import { get, post } from '../services/api';
import { adaptQuestion } from '../services/adapter';
import ChoiceQuestion from '../components/ChoiceQuestion';
import MultiChoiceQuestion from '../components/MultiChoiceQuestion';
import JudgmentQuestion from '../components/JudgmentQuestion';
import QuestionSidebar from '../components/QuestionSidebar';
import ExamSelector from '../components/ExamSelector';
import BackToTop from '../components/BackToTop';

const EXAM_RESULT_KEY = 'exam-result';

async function loadQuestions(subjectId, sessionId) {
  let all = [];
  let page = 1;
  const pageSize = 100;
  while (true) {
    const res = await get(`/subjects/${subjectId}/questions?mode=exam&page=${page}&pageSize=${pageSize}&session_id=${sessionId}`);
    all = all.concat(res.questions || []);
    if (all.length >= res.total) break;
    page++;
  }
  return all.map(adaptQuestion);
}

function sortQuestions(questions) {
  const order = { choice: 0, multi_choice: 1, judgment: 2 };
  return [...questions].sort((a, b) => (order[a.__type] ?? 99) - (order[b.__type] ?? 99));
}

function ExamContent({ examSession }) {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { questions, answers, submitExam, examSubmitted, submitting } = useExam();
  const [currentIndex, setCurrentIndex] = useState(0);

  const sorted = useMemo(() => sortQuestions(questions), [questions]);
  const current = sorted[currentIndex];
  const total = sorted.length;

  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex(i => Math.min(total - 1, i + 1));
  const handleJump = (idx) => setCurrentIndex(idx);

  const handleSubmit = useCallback(async () => {
    const result = await submitExam();
    if (result) {
      const data = {
        questions: sorted,
        answers: { ...answers },
        scoreResult: result,
        subjectId,
      };
      localStorage.setItem(EXAM_RESULT_KEY, JSON.stringify(data));
      navigate(`/exam/${subjectId}/result`, { replace: true });
    }
  }, [submitExam, sorted, answers, subjectId, navigate]);

  if (total === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-500">暂无题目</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20 lg:pb-0">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 lg:py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg lg:text-2xl font-bold">{examSession?.exam_config?.name || '考试模式'}</h1>
            <p className="text-white/80 text-xs lg:text-sm mt-0.5 lg:mt-1">
              {currentIndex + 1} / {total}
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-sm text-white/70">
            <span>共 {examSession?.question_count || total} 题</span>
            {examSession?.expires_at && (
              <span>截止: {new Date(examSession.expires_at).toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 lg:px-4 py-3 lg:py-6 flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-3 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3 lg:mb-6">
              <span className="text-xs lg:text-sm text-gray-500 font-medium">
                第 {currentIndex + 1} 题
              </span>
              <div className="hidden lg:flex gap-1 overflow-x-auto max-w-[200px]">
                {sorted.map((_, i) => (
                  <div
                    key={i}
                    className={`flex-shrink-0 w-2 h-2 rounded-full ${
                      i === currentIndex
                        ? 'bg-orange-500 scale-125'
                        : answers[String(sorted[i].id)] !== undefined
                          ? 'bg-orange-300'
                          : 'bg-gray-200'
                    } transition-all`}
                  />
                ))}
              </div>
              <span className="lg:hidden text-xs text-gray-400">{currentIndex + 1}/{total}</span>
            </div>

            {current.__type === 'choice' && (
              <ChoiceQuestion question={current} index={currentIndex} />
            )}
            {current.__type === 'multi_choice' && (
              <MultiChoiceQuestion question={current} index={currentIndex} />
            )}
            {current.__type === 'judgment' && (
              <JudgmentQuestion question={current} index={currentIndex} />
            )}
          </div>

          <div className="lg:flex hidden items-center justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              上一题
            </button>
            <span className="text-sm text-gray-500">{currentIndex + 1} / {total}</span>
            <button
              onClick={handleNext}
              disabled={currentIndex === total - 1}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              下一题
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <QuestionSidebar
          questions={sorted}
          answers={answers}
          currentIndex={currentIndex}
          mode="exam"
          onJump={handleJump}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>

      {/* Mobile fixed bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-3 py-3 flex items-center justify-between shadow-lg">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-orange-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-sm mr-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          上一题
        </button>
        <span className="text-xs text-gray-500 flex-shrink-0 mx-1">{currentIndex + 1}/{total}</span>
        <button
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          className="flex-1 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-orange-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-sm ml-2"
        >
          下一题
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <BackToTop />
    </div>
  );
}

export default function ExamPage() {
  const { subjectId } = useParams();
  const [phase, setPhase] = useState('exam-select');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [examSession, setExamSession] = useState(null);

  const handleExamStart = useCallback(async (session) => {
    setExamSession(session);
    setPhase('loading');
    try {
      const qs = await loadQuestions(subjectId, session.session_id);
      setQuestions(qs);
      setPhase('ready');
    } catch (err) {
      setError(err.message || '加载题目失败');
      setPhase('error');
    }
  }, [subjectId]);

  return (
    <>
      {phase === 'exam-select' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-white py-8 px-4 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">考试模式</h1>
              <p className="text-white/80">请选择题库开始考试</p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <ExamSelector subjectId={subjectId} onStart={handleExamStart} />
          </div>
        </div>
      )}

      {phase === 'loading' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {phase === 'error' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => setPhase('exam-select')}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
            >
              返回选择考试
            </button>
          </div>
        </div>
      )}

      {phase === 'ready' && examSession && (
        <ExamProvider
          questions={questions}
          mode="exam"
          subjectId={subjectId}
          examSessionId={examSession.session_id}
        >
          <ExamContent examSession={examSession} />
        </ExamProvider>
      )}
    </>
  );
}
