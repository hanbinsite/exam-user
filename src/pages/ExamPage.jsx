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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">题库不存在</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExamProvider examData={currentExamData}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentExamData.info.title}</h1>
            <p className="text-gray-600">
              共 {currentExamData.info.totalChoice} 道选择题，{currentExamData.info.totalJudgment} 道判断题
            </p>
          </div>

          <StatsCard />

          {currentExamData.choiceQuestions.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm">单</span>
                选择题
              </h2>
              {currentExamData.choiceQuestions.map((q, idx) => (
                <ChoiceQuestion key={q.id} question={q} index={idx} />
              ))}
            </section>
          )}

          {currentExamData.judgmentQuestions.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm">判</span>
                判断题
              </h2>
              {currentExamData.judgmentQuestions.map((q, idx) => (
                <JudgmentQuestion key={q.id} question={q} index={idx} />
              ))}
            </section>
          )}

          <div className="text-center py-8">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </ExamProvider>
  );
}
