import { useExam } from '../contexts/ExamContext';

export default function StatsCard() {
  const { stats, resetAnswers } = useExam();

  const totalQuestions = stats.totalChoice + stats.totalJudgment;
  const answeredTotal = stats.answeredChoice + stats.answeredJudgment;
  const correctTotal = stats.correctChoice + stats.correctJudgment;
  const wrongTotal = stats.wrongChoice + stats.wrongJudgment;
  const progress = totalQuestions > 0 ? Math.round((answeredTotal / totalQuestions) * 100) : 0;
  const accuracy = answeredTotal > 0 ? Math.round((correctTotal / answeredTotal) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
      
      <div className="flex items-center justify-between mb-6 relative">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          答题统计
        </h2>
        <button
          onClick={resetAnswers}
          className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-50 hover:to-red-100 hover:text-red-600 rounded-xl transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重新开始
        </button>
      </div>

      <div className="mb-6 relative">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">答题进度</span>
          <span className="font-bold text-indigo-600">{progress}%</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            {progress > 5 && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>已答 {answeredTotal} 题</span>
          <span>共 {totalQuestions} 题</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center border border-green-100 hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-green-600">{correctTotal}</div>
          <div className="text-sm text-green-600 mt-1 font-medium">正确</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 text-center border border-red-100 hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-red-600">{wrongTotal}</div>
          <div className="text-sm text-red-600 mt-1 font-medium">错误</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-4 text-center border border-blue-100 hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.answeredChoice}</div>
          <div className="text-sm text-blue-600 mt-1 font-medium">选择题已答</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 text-center border border-purple-100 hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-purple-600">{stats.answeredJudgment}</div>
          <div className="text-sm text-purple-600 mt-1 font-medium">判断题已答</div>
        </div>
      </div>

      {answeredTotal > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 relative">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">正确率</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    accuracy >= 60 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-orange-400 to-red-500'
                  }`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <span className={`font-bold text-xl ${accuracy >= 60 ? 'text-green-600' : 'text-orange-500'}`}>
                {accuracy}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
