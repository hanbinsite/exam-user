import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, post } from '../services/api';
import { adaptQuestion } from '../services/adapter';
import { ExamProvider } from '../contexts/ExamContext';
import ChoiceQuestion from '../components/ChoiceQuestion';
import MultiChoiceQuestion from '../components/MultiChoiceQuestion';
import JudgmentQuestion from '../components/JudgmentQuestion';

const TYPE_TAG = {
  choice: { label: '单选', cls: 'bg-blue-100 text-blue-700' },
  multi_choice: { label: '多选', cls: 'bg-amber-100 text-amber-700' },
  judgment: { label: '判断', cls: 'bg-purple-100 text-purple-700' },
};

function formatAnswer(val) {
  if (val === 'true') return '正确';
  if (val === 'false') return '错误';
  return val;
}

export default function WrongQuestionsPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState('list');
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [mastering, setMastering] = useState({});
  const [filterMastered, setFilterMastered] = useState(null);
  const [questionDetails, setQuestionDetails] = useState({});
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(false);

  useEffect(() => {
    get(`/subjects/${subjectId}`).then(setSubjectInfo).catch(() => {});
  }, [subjectId]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await get(`/wrong-questions/stats?subjectId=${subjectId}`);
      setStats(res);
    } catch {}
  }, [subjectId]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      let params = `subjectId=${subjectId}&page=${page}&pageSize=20`;
      if (filterMastered !== null) params += `&mastered=${filterMastered}`;
      const res = await get(`/wrong-questions?${params}`);
      const list = res.questions || [];
      setQuestions(list);
      setTotal(res.total || 0);

      const missing = list
        .map(q => q.question_id)
        .filter(id => !questionDetails[id]);
      if (missing.length > 0) {
        const details = await Promise.all(
          missing.map(id => get(`/questions/${id}`).catch(() => null))
        );
        setQuestionDetails(prev => {
          const next = { ...prev };
          details.forEach(d => {
            if (d) next[d.id] = d;
          });
          return next;
        });
      }
    } catch {}
    setLoading(false);
  }, [subjectId, page, filterMastered, questionDetails]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (tab === 'list') fetchQuestions();
  }, [tab, page, filterMastered]);

  const handleMaster = async (wrongId) => {
    setMastering(prev => ({ ...prev, [wrongId]: true }));
    try {
      await post(`/wrong-questions/${wrongId}/master`);
      fetchStats();
      fetchQuestions();
    } catch {}
    setMastering(prev => ({ ...prev, [wrongId]: false }));
  };

  const handlePractice = async () => {
    setPracticeLoading(true);
    try {
      const res = await post(`/wrong-questions/practice?subjectId=${subjectId}&limit=50`);
      setPracticeQuestions((res.questions || []).map(adaptQuestion));
      setTab('practice');
    } catch {}
    setPracticeLoading(false);
  };

  const adaptedQuestions = practiceQuestions.map(q => ({
    ...q,
    answer: q.__type === 'multi_choice' && typeof q.answer === 'string' ? q.answer.split('') : q.answer,
  }));

  const choiceQs = adaptedQuestions.filter(q => q.__type === 'choice');
  const multiChoiceQs = adaptedQuestions.filter(q => q.__type === 'multi_choice');
  const judgmentQs = adaptedQuestions.filter(q => q.__type === 'judgment');

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white py-8 px-4 shadow-lg">
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
          <h1 className="text-3xl font-bold mb-2">错题集</h1>
          <p className="text-white/80">{subjectInfo?.name || '加载中...'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {stats && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 text-center border border-red-100">
                <div className="text-3xl font-bold text-red-600">{stats.total || 0}</div>
                <div className="text-sm text-red-600 mt-1 font-medium">总错题</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 text-center border border-orange-100">
                <div className="text-3xl font-bold text-orange-600">{stats.unmastered || 0}</div>
                <div className="text-sm text-orange-600 mt-1 font-medium">未掌握</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center border border-green-100">
                <div className="text-3xl font-bold text-green-600">{stats.mastered || 0}</div>
                <div className="text-sm text-green-600 mt-1 font-medium">已掌握</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-100">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.total > 0 ? Math.round(((stats.mastered || 0) / stats.total) * 100) : 0}%
                </div>
                <div className="text-sm text-blue-600 mt-1 font-medium">掌握率</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab('list')}
            className={`px-5 py-2 rounded-xl font-medium transition-all shadow-md ${
              tab === 'list'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            错题列表
          </button>
          <button
            onClick={handlePractice}
            disabled={practiceLoading || (stats?.unmastered || 0) === 0}
            className={`px-5 py-2 rounded-xl font-medium transition-all shadow-md ${
              tab === 'practice'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {practiceLoading ? '加载中...' : '错题练习'}
          </button>
          <div className="flex-1" />
          <select
            value={filterMastered === null ? '' : filterMastered ? 'true' : 'false'}
            onChange={e => {
              const v = e.target.value;
              setFilterMastered(v === '' ? null : v === 'true');
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="">全部</option>
            <option value="false">未掌握</option>
            <option value="true">已掌握</option>
          </select>
        </div>

        {tab === 'list' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">
                  {filterMastered === false ? '没有未掌握的错题' : filterMastered === true ? '没有已掌握的错题' : '暂无错题，继续保持！'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const detail = questionDetails[q.question_id];
                  const qType = q.question?.type?.name;
                  const tag = TYPE_TAG[qType] || { label: '题目', cls: 'bg-gray-100 text-gray-700' };
                  const options = detail?.content?.options || [];

                  return (
                    <div key={q.wrong_id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-start gap-4 mb-4">
                        <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
                          {(page - 1) * 20 + idx + 1}
                        </span>
                        <p className="text-gray-800 font-medium leading-relaxed flex-1 text-base">{q.question?.title}</p>
                        <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${tag.cls}`}>{tag.label}</span>
                      </div>

                      {options.length > 0 && (
                        <div className="space-y-2 ml-14 mb-4">
                          {options.map(opt => {
                            const correctKeys = q.correct_answer ? q.correct_answer.split('') : [];
                            const userKeys = q.user_answer ? q.user_answer.split('') : [];
                            const isCorrect = correctKeys.includes(opt.key);
                            const isWrong = userKeys.includes(opt.key) && !correctKeys.includes(opt.key);
                            return (
                              <div
                                key={opt.key}
                                className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                                  isCorrect ? 'bg-green-50 text-green-800 border border-green-200'
                                    : isWrong ? 'bg-red-50 text-red-800 border border-red-200'
                                    : 'bg-gray-50 text-gray-600'
                                }`}
                              >
                                <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold ${
                                  isCorrect ? 'bg-green-500 text-white'
                                    : isWrong ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>{opt.key}</span>
                                <span className="flex-1">{opt.text}</span>
                                {isCorrect && (
                                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {isWrong && (
                                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {qType === 'judgment' && options.length === 0 && (
                        <div className="flex gap-3 ml-14 mb-4">
                          <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            q.correct_answer === 'true' ? 'bg-green-50 text-green-800 border border-green-200'
                              : q.user_answer === 'true' && q.correct_answer !== 'true' ? 'bg-red-50 text-red-800 border border-red-200'
                              : 'bg-gray-50 text-gray-600'
                          }`}>
                            正确{q.correct_answer === 'true' ? ' ✓' : ''}{q.user_answer === 'true' && q.correct_answer !== 'true' ? ' ✗' : ''}
                          </span>
                          <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            q.correct_answer === 'false' ? 'bg-green-50 text-green-800 border border-green-200'
                              : q.user_answer === 'false' && q.correct_answer !== 'false' ? 'bg-red-50 text-red-800 border border-red-200'
                              : 'bg-gray-50 text-gray-600'
                          }`}>
                            错误{q.correct_answer === 'false' ? ' ✓' : ''}{q.user_answer === 'false' && q.correct_answer !== 'false' ? ' ✗' : ''}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 ml-14">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-red-500">你的答案: <span className="font-semibold">{formatAnswer(q.user_answer)}</span></span>
                          <span className="text-gray-300">|</span>
                          <span className="text-green-600">正确答案: <span className="font-semibold">{formatAnswer(q.correct_answer)}</span></span>
                        </div>
                        <div className="flex-1" />
                        {q.is_mastered ? (
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">已掌握</span>
                        ) : (
                          <button
                            onClick={() => handleMaster(q.wrong_id)}
                            disabled={mastering[q.wrong_id]}
                            className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
                          >
                            {mastering[q.wrong_id] ? '处理中...' : '标记已掌握'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一页
                    </button>
                    <span className="text-gray-600 text-sm">{page} / {totalPages}</span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下一页
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {tab === 'practice' && practiceQuestions.length > 0 && (
          <ExamProvider questions={adaptedQuestions} mode="practice" subjectId={subjectId}>
            {choiceQs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">选</span>
                  <span>单选题</span>
                  <span className="text-sm font-normal text-gray-500 bg-blue-100 px-3 py-1 rounded-full">{choiceQs.length} 题</span>
                </h2>
                {choiceQs.map((q, idx) => <ChoiceQuestion key={q.id} question={q} index={idx} />)}
              </section>
            )}
            {multiChoiceQs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">多</span>
                  <span>多选题</span>
                  <span className="text-sm font-normal text-gray-500 bg-amber-100 px-3 py-1 rounded-full">{multiChoiceQs.length} 题</span>
                </h2>
                {multiChoiceQs.map((q, idx) => <MultiChoiceQuestion key={q.id} question={q} index={idx} />)}
              </section>
            )}
            {judgmentQs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">判</span>
                  <span>判断题</span>
                  <span className="text-sm font-normal text-gray-500 bg-purple-100 px-3 py-1 rounded-full">{judgmentQs.length} 题</span>
                </h2>
                {judgmentQs.map((q, idx) => <JudgmentQuestion key={q.id} question={q} index={idx} />)}
              </section>
            )}
            <div className="text-center py-8">
              <button
                onClick={() => { setTab('list'); setPracticeQuestions([]); }}
                className="px-8 py-3 bg-white border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700 hover:text-orange-600 rounded-xl transition-all shadow-md"
              >
                返回错题列表
              </button>
            </div>
          </ExamProvider>
        )}
      </div>
    </div>
  );
}
