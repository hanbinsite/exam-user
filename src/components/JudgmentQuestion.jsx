import { useExam } from '../contexts/ExamContext';

export default function JudgmentQuestion({ question, index }) {
  const { judgmentAnswers, setJudgmentAnswer } = useExam();
  const selected = judgmentAnswers[question.id];
  const isAnswered = selected !== undefined;
  const isCorrect = selected === question.answer;

  const getButtonClass = (value) => {
    if (!isAnswered) {
      return value 
        ? 'border-green-200 hover:bg-green-50 hover:border-green-400 text-green-700'
        : 'border-red-200 hover:bg-red-50 hover:border-red-400 text-red-700';
    }
    if (value === question.answer) {
      return value 
        ? 'border-green-500 bg-green-100 text-green-800'
        : 'border-red-500 bg-red-100 text-red-800';
    }
    if (value === selected && selected !== question.answer) {
      return value
        ? 'border-red-400 bg-red-50 text-red-700 opacity-60'
        : 'border-green-400 bg-green-50 text-green-700 opacity-60';
    }
    return 'border-gray-200 opacity-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4 border border-gray-100 transition-all hover:shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
          {index + 1}
        </span>
        <p className="text-gray-800 font-medium leading-relaxed flex-1">{question.question}</p>
      </div>
      
      <div className="flex gap-4 ml-11">
        <button
          onClick={() => !isAnswered && setJudgmentAnswer(question.id, true)}
          disabled={isAnswered}
          className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition-all ${getButtonClass(true)}`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            正确
          </span>
        </button>
        <button
          onClick={() => !isAnswered && setJudgmentAnswer(question.id, false)}
          disabled={isAnswered}
          className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition-all ${getButtonClass(false)}`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            错误
          </span>
        </button>
      </div>

      {isAnswered && (
        <div className={`mt-4 ml-11 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isCorrect ? '✓ 回答正确！' : `✗ 回答错误，正确答案是 ${question.answer ? '正确' : '错误'}`}
        </div>
      )}
    </div>
  );
}
