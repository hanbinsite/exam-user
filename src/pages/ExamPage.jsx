import { useParams, useNavigate } from 'react-router-dom';
import { ExamProvider } from '../contexts/ExamContext';
import StatsCard from '../components/StatsCard';
import ChoiceQuestion from '../components/ChoiceQuestion';
import JudgmentQuestion from '../components/JudgmentQuestion';
import examData from '../data/exam-blockchain.json';

export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const dataMap = {
    'blockchain': examData,
  };

  const currentExamData = dataMap[examId];

  if (!currentExamData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">题库不存在</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExamProvider examData={currentExamData}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
            <h1 className="text-3xl font-bold mb-2">{currentExamData.info.title}</h1>
            <p className="text-white/80">
              共 {currentExamData.info.totalChoice} 道选择题，{currentExamData.info.totalJudgment} 道判断题
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <StatsCard />

          {currentExamData.choiceQuestions.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">
                  选
                </span>
                <span>选择题</span>
                <span className="text-sm font-normal text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                  {currentExamData.info.totalChoice} 题
                </span>
              </h2>
              {currentExamData.choiceQuestions.map((q, idx) => (
                <ChoiceQuestion key={q.id} question={q} index={idx} />
              ))}
            </section>
          )}

          {currentExamData.judgmentQuestions.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">
                  判
                </span>
                <span>判断题</span>
                <span className="text-sm font-normal text-gray-500 bg-purple-100 px-3 py-1 rounded-full">
                  {currentExamData.info.totalJudgment} 题
                </span>
              </h2>
              {currentExamData.judgmentQuestions.map((q, idx) => (
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
        </div>
      </div>
    </ExamProvider>
  );
}
