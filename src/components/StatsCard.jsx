import { useExam } from '../contexts/ExamContext';

export default function StatsCard() {
  const { stats, resetAnswers } = useExam();
  
  const totalQuestions = stats.totalChoice + stats.totalJudgment;
  const answeredTotal = stats.answeredChoice + stats.answeredJudgment;
  const correctTotal = stats.correctChoice + stats.correctJudgment;
  const wrongTotal = stats.wrongChoice + stats.wrongJudgment;
  const progress = totalQuestions > 0 ? Math.round((answeredTotal / totalQuestions) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">答题统计</h2>
        <button
          onClick={resetAnswers}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          重新开始
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">答题进度</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          已答 {answeredTotal} / 共 {totalQuestions} 题
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{correctTotal}</div>
          <div className="text-sm text-green-700 mt-1">正确</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{wrongTotal}</div>
          <div className="text-sm text-red-700 mt-1">错误</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.answeredChoice}</div>
          <div className="text-sm text-blue-700 mt-1">选择题已答</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.answeredJudgment}</div>
          <div className="text-sm text-purple-700 mt-1">判断题已答</div>
        </div>
      </div>

      {answeredTotal > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">正确率</span>
            <span className={`font-bold text-lg ${correctTotal / answeredTotal >= 0.6 ? 'text-green-600' : 'text-orange-500'}`}>
              {Math.round((correctTotal / answeredTotal) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
