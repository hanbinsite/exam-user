import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHomeButton from '../components/BackHomeButton';
import { normalizeMultiAnswer } from '../services/adapter';

function formatAnswer(val, type) {
  if (val === undefined || val === null) return '未作答';
  if (type === 'judgment') return val ? '正确' : '错误';
  if (type === 'multi_choice') return normalizeMultiAnswer(val).join('、') || '未作答';
  return String(val);
}

export default function ExamResultPage() {
  const navigate = useNavigate();
  const raw = localStorage.getItem('exam-result');

  const result = useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [raw]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">没有考试记录</p>
          <p className="text-gray-400 text-sm mb-4">请先完成一次考试</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const { questions, answers, scoreResult } = result;
  const total = questions.length;
  const typeScores = scoreResult?.type_scores || {};
  const correctCount = (scoreResult?.choice_correct || 0) + (typeScores.multi_choice?.correct || 0) + (scoreResult?.judgment_correct || 0);
  const wrongCount = scoreResult?.wrong_count || 0;
  const totalScore = scoreResult?.total_score || 0;

  const wrongQuestions = questions.filter(q => {
    const userAns = answers[String(q.id)];
    const correctArr = q.__type === 'multi_choice' ? normalizeMultiAnswer(q.answer) : [];
    const isCorrect = q.__type === 'multi_choice'
      ? Array.isArray(userAns) && userAns.length === correctArr.length && userAns.every(k => correctArr.includes(k))
      : userAns === q.answer;
    return userAns !== undefined && !isCorrect;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">考试完成</h1>
          <p className="text-white/80">成绩已记录</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {totalScore} 分
            </div>
            <p className="text-gray-500 mt-2">总分</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-100">
              <div className="text-3xl font-bold text-blue-600">{total}</div>
              <div className="text-sm text-blue-600 mt-1 font-medium">总题数</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center border border-green-100">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-green-600 mt-1 font-medium">正确</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 text-center border border-red-100">
              <div className="text-3xl font-bold text-red-600">{wrongCount}</div>
              <div className="text-sm text-red-600 mt-1 font-medium">错误</div>
            </div>
          </div>
          {scoreResult?.attempt_number && (
            <p className="text-center text-gray-400 text-sm mt-4">第 {scoreResult.attempt_number} 次考试</p>
          )}
        </div>

        {wrongQuestions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">
                错
              </span>
              <span>错题回顾</span>
              <span className="text-sm font-normal text-gray-500 bg-red-100 px-3 py-1 rounded-full">
                {wrongQuestions.length} 题
              </span>
            </h2>
            <div className="space-y-4">
              {wrongQuestions.map((q, idx) => {
                const userAns = answers[String(q.id)];
                return (
                  <div key={q.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
                        {idx + 1}
                      </span>
                      <p className="text-gray-800 font-medium leading-relaxed flex-1 text-base">{q.question}</p>
                      <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                        q.__type === 'choice' ? 'bg-blue-100 text-blue-700'
                          : q.__type === 'multi_choice' ? 'bg-amber-100 text-amber-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {q.__type === 'choice' ? '单选' : q.__type === 'multi_choice' ? '多选' : '判断'}
                      </span>
                    </div>

                    {q.options && q.options.length > 0 && (
                      <div className="space-y-2 ml-14 mb-4">
                        {q.options.map(opt => {
                          const correctKeys = q.__type === 'multi_choice' ? normalizeMultiAnswer(q.answer) : (q.answer !== undefined ? [q.answer] : []);
                          const userKeys = q.__type === 'multi_choice' ? (userAns || []) : [userAns];
                          const isCorrectOpt = correctKeys.includes(opt.key);
                          const isWrongOpt = userKeys.includes(opt.key) && !correctKeys.includes(opt.key);
                          return (
                            <div
                              key={opt.key}
                              className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                                isCorrectOpt ? 'bg-green-50 text-green-800 border border-green-200'
                                  : isWrongOpt ? 'bg-red-50 text-red-800 border border-red-200'
                                  : 'bg-gray-50 text-gray-600'
                              }`}
                            >
                              <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold ${
                                isCorrectOpt ? 'bg-green-500 text-white'
                                  : isWrongOpt ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}>{opt.key}</span>
                              <span className="flex-1">{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="ml-14 flex items-center gap-4 text-sm">
                      <span className="text-red-500">
                        你的答案: <span className="font-semibold">{formatAnswer(userAns, q.__type)}</span>
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-green-600">
                        正确答案: <span className="font-semibold">{formatAnswer(q.answer, q.__type)}</span>
                      </span>
                    </div>

                    {q.explanation && (
                      <div className="ml-14 mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <p className="text-sm text-indigo-700">
                          <span className="font-semibold">解析：</span>{q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {wrongQuestions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium text-lg mb-2">全部答对！</p>
            <p className="text-gray-400 text-sm">完美表现！</p>
          </div>
        )}

        <BackHomeButton color="orange" />
      </div>
    </div>
  );
}
