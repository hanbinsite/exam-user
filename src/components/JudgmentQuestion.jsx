import { useExam } from '../contexts/ExamContext';

export default function JudgmentQuestion({ question, index }) {
  const { judgmentAnswers, setJudgmentAnswer } = useExam();
  const selected = judgmentAnswers[question.id];
  const isAnswered = selected !== undefined;
  const isCorrect = selected === question.answer;

  const getButtonClass = (value) => {
    if (!isAnswered) {
      return value
        ? 'border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-400 text-green-700 hover:shadow-lg'
        : 'border-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:border-red-400 text-red-700 hover:shadow-lg';
    }
    if (value === question.answer) {
      return value
        ? 'border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-lg'
        : 'border-red-500 bg-gradient-to-r from-red-100 to-rose-100 text-red-800 shadow-lg';
    }
    if (value === selected && selected !== question.answer) {
      return value
        ? 'border-red-400 bg-red-50 text-red-600 opacity-60'
        : 'border-green-400 bg-green-50 text-green-600 opacity-60';
    }
    return 'border-gray-200 opacity-50 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex items-start gap-4 mb-5">
        <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
          {index + 1}
        </span>
        <p className="text-gray-800 font-medium leading-relaxed flex-1 text-base">{question.question}</p>
      </div>
      
      <div className="flex gap-4 ml-14">
        <button
          onClick={() => !isAnswered && setJudgmentAnswer(question.id, true)}
          disabled={isAnswered}
          className={`flex-1 py-4 px-6 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-3 ${getButtonClass(true)}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isAnswered && question.answer === true
              ? 'bg-green-500'
              : isAnswered && selected === true && !question.answer
                ? 'bg-red-500'
                : 'bg-green-100'
          }`}>
            <svg className={`w-5 h-5 ${
              isAnswered && question.answer === true
                ? 'text-white'
                : isAnswered && selected === true && !question.answer
                  ? 'text-white'
                  : 'text-green-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-base">正确</span>
        </button>
        
        <button
          onClick={() => !isAnswered && setJudgmentAnswer(question.id, false)}
          disabled={isAnswered}
          className={`flex-1 py-4 px-6 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-3 ${getButtonClass(false)}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isAnswered && question.answer === false
              ? 'bg-red-500'
              : isAnswered && selected === false && question.answer
                ? 'bg-green-500'
                : 'bg-red-100'
          }`}>
            <svg className={`w-5 h-5 ${
              isAnswered && question.answer === false
                ? 'text-white'
                : isAnswered && selected === false && question.answer
                  ? 'text-white'
                  : 'text-red-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-base">错误</span>
        </button>
      </div>

      {isAnswered && (
        <div className={`mt-5 ml-14 p-4 rounded-xl flex items-center gap-3 ${
          isCorrect
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
            : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
        }`}>
          {isCorrect ? (
            <>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">回答正确！</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">回答错误，正确答案是 <span className="bg-white px-2 py-1 rounded font-bold">{question.answer ? '正确' : '错误'}</span></span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
